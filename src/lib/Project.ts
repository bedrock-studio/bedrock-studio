import * as vscode from 'vscode';

import { Collection, Document, Scope, DocumentType } from './DocumentGraph';
import * as DocumentTypes from './Documents';

export class Project implements vscode.CompletionItemProvider, vscode.HoverProvider, vscode.DefinitionProvider, vscode.ReferenceProvider, vscode.DocumentHighlightProvider, vscode.DocumentSymbolProvider, vscode.RenameProvider {

    /**
     * The document types the project can handle.
     */
    private documentTypes = new Collection(Object.values<DocumentType<any, any, any>>(DocumentTypes));

    /**
     * The document loaders the project uses.
     */
    private documentLoaders = this.documentTypes
        .GroupBy(t => t.documentLoader)
        .Select(([loader, docs]) => loader.build(this, docs))
        .ToMap(l => l.type);

    /**
     * The global project scope.
     */
    public readonly scope = new Scope();

    /**
     * A collection of all documents that have been loaded into the project.
     */
    private readonly loadedDocuments = new Map<vscode.TextDocument, Document>();

    /**
     * Loads all available documents from the workspace.
     */
    public async loadAllDocuments(): Promise<void> {

        // Determine the files that need loaded
        const filesToLoad = this.documentTypes
            .SelectMany(docType => docType.filePathFilter)
            .SelectManyAsync(async (pattern) => await vscode.workspace.findFiles(pattern));

        // Load each file
        for await (const file of filesToLoad) {
            this.tryLoadDocument(await vscode.workspace.openTextDocument(file));
        }

        // Resolve references
        this.ensureResolvedReferences();
    }

    /**
     * Ensures that symbol references in all files have been resolved
     */
    public ensureResolvedReferences(): void {
        for (const document of this.loadedDocuments.values()) {
            document.ensureResolvedReferences();
        }
    }

    /**
     * Loads the specified document into the project.
     * @param vsdocument The document to load
     */
    public tryLoadDocument(vsdocument: vscode.TextDocument, reload = false): Document<any, any, any> | null {
        if (reload) {
            this.unloadDocument(vsdocument);
        }

        // Check for an existing document
        // Sidenote: If we ever need to make this function async, change this
        // such that we don't start loading a document while it's already loading
        const existingDocument = this.loadedDocuments.get(vsdocument);
        if (existingDocument)
            return existingDocument;

        // Get the loaders that can handle this document
        const matchingLoaders = new Collection(this.documentLoaders)
            .Where(([type]) => !!vscode.languages.match(type.selector, vsdocument))
            .Select(([_, value]) => value)
            .ToArray();

        // Try each loader
        for (const loader of matchingLoaders) {
            const document = loader.tryLoad(vsdocument);
            if (document) {
                this.loadedDocuments.set(vsdocument, document);
                return document;
            }
        }
        return null;
    }

    /**
     * Unloads a document.
     * @param vsdocument The document to unload.
     */
    public unloadDocument(vsdocument: vscode.TextDocument): void {
        const existingDocument = this.loadedDocuments.get(vsdocument);
        if (existingDocument) {
            existingDocument.destroy();
            this.loadedDocuments.delete(vsdocument);
        }
    }

    public provideCompletionItems(vsdocument: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
        const document = this.tryLoadDocument(vsdocument, true);
        if (document) {
            return document.getCompletionItems(position, token, context);
        }
    }

    public provideHover(vsdocument: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
        const document = this.tryLoadDocument(vsdocument, true);
        if (document) {
            return document.getHover(position, token);
        }
    }

    public provideDefinition(vsdocument: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Location | vscode.Location[] | vscode.LocationLink[]> {
        const document = this.tryLoadDocument(vsdocument, true);
        if (document) {
            return document.getMatchingSymbols(position)
                .SelectMany(s => s.definitions)
                .Select(d => new vscode.Location(d.parentDocument.document.uri, d.range))
                .ToArray();
        }
    }

    public provideReferences(vsdocument: vscode.TextDocument, position: vscode.Position, context: vscode.ReferenceContext, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Location[]> {
        const document = this.tryLoadDocument(vsdocument, true);
        if (document) {
            document.ensureResolvedReferences();
            return document.getMatchingSymbols(position)
                .SelectMany(s => s.references)
                .Select(r => new vscode.Location(r.parentDocument.document.uri, r.range))
                .ToArray();
        }
    }

    public provideDocumentHighlights(vsdocument: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentHighlight[]> {
        const document = this.tryLoadDocument(vsdocument, true);
        if (document) {
            document.ensureResolvedReferences();
            return document.getMatchingSymbols(position)
                .SelectMany(s => s.references)
                .Where(r => r.parentDocument === document)
                .Select(r => new vscode.DocumentHighlight(r.range, vscode.DocumentHighlightKind.Text))
                .ToArray();
        }
    }

    /**
     * Provides a list of symbols that are defined in the current document.
     * @param vsdocument The vscode document.
     * @param token The cancellation token.
     */
    public provideDocumentSymbols(vsdocument: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.SymbolInformation[] | vscode.DocumentSymbol[]> {
        const document = this.tryLoadDocument(vsdocument, true);
        if (document) {
            return document.getDocumentSymbols(token);
        }
    }

    /**
     * Provides the WorkspaceEdit needed to rename a symbol.
     * @param vsdocument The vscode TextDocument.
     * @param position The position.
     * @param newName The new name.
     * @param token The cancellation token.
     */
    public async provideRenameEdits(vsdocument: vscode.TextDocument, position: vscode.Position, newName: string, token: vscode.CancellationToken): Promise<vscode.WorkspaceEdit | undefined> {
        this.ensureResolvedReferences();
        const document = this.tryLoadDocument(vsdocument, true);
        if (document) {
            // Get the edits for each document
            const documentEdits = document.getMatchingSymbols(position)
                .SelectMany(s => s.references)
                .Distinct()
                .GroupBy(r => r.parentDocument);

            // Build the workspace edit
            const workspaceEdit = new vscode.WorkspaceEdit()
            for (const [document, references] of documentEdits) {
                const textEdits = await document.getRenameEdits(references, newName, token);
                if (textEdits && textEdits.length > 0) {
                    workspaceEdit.set(document.document.uri, textEdits);
                }
            }
            return workspaceEdit;
        }
    }
}
