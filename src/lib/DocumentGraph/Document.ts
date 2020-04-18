import * as vscode from 'vscode';

import { Collection } from './Collection';
import { Definition } from "./Definition";
import { DocumentType } from "./DocumentType";
import { DocumentLoader } from "./DocumentLoader";
import { Project } from '../Project';
import { Symbol } from "./Symbol";
import { Reference } from "./Reference";

export abstract class Document<
    TDoc extends Document<TDoc, TLoader, TDocType> = Document<any, any, any>,
    TLoader extends DocumentLoader<TLoader, TDoc, TDocType> = DocumentLoader<any, any, any>,
    TDocType extends DocumentType<TDocType, TDoc, TLoader> = DocumentType<any, any, any>
    > {
    
    /**
     * The type of document.
     */
    public abstract readonly type: TDocType & (new (...params: any[]) => TDoc);
    
    /**
     * The project this document is a part of.
     */
    public readonly project: Project;
    
    /**
     * The vscode TextDocument that this document was loaded from.
     */
    public readonly document: vscode.TextDocument;
    
    /**
     * The parent document, if this document is embeded within another document.
     */
    public readonly parentDocument?: TDoc;
    
    /**
     * The parent definition, if this document is embeded within a definition in another document.
     */
    public readonly parentDefinition?: Definition<TDoc>;

    /**
     * The child definitions.
     */
    public readonly childDefinitions: Set<Definition<TDoc>>;

    /**
     * The child references.
     */
    public readonly childReferences: Set<Reference<TDoc>>;
    
    /**
     * Creates a new Document.
     * @param project The project.
     * @param document The vscode TextDocument.
     */
    constructor(project: Project, document: vscode.TextDocument) {
        this.project = project;
        this.document = document;
        this.childDefinitions = new Set();
        this.childReferences = new Set();
    }

    /**
     * Destroys all links controlled by this document or it's children.
     */
    public destroy(): void {
        this.childDefinitions.forEach(d => d.destroy());
        this.childDefinitions.clear();
        this.childReferences.forEach(r => r.destroy());
        this.childReferences.clear();
    }

    /**
     * Ensures symbol references are resolved
     */
    public ensureResolvedReferences(): void {
        this.childDefinitions.forEach(d => d.ensureResolvedReferences());
        this.childReferences.forEach(r => r.ensureResolved());
    }

    /**
     * Gets any symbols that match the reference at the specified location.
     * @param position The position.
     */
    public getMatchingSymbols(position: vscode.Position): Collection<Symbol<any>> {
        return this.getMatchingReference(position)?.getMatchingSymbols() || new Collection([]);
    }

    /**
     * Gets any symbols that match the reference at the specified location.
     * @param position The position.
     */
    public getMatchingReference(position: vscode.Position): Reference | null {
        for(const reference of this.childReferences) {
            if(reference.range.contains(position)) {
                return reference;
            }
        }
        for(const definition of this.childDefinitions) {
            if(definition.range.contains(position)) {
                return definition.getMatchingReference(position);
            }
        }
        return null;
    }
    
    public getCompletionItems(position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
        const reference = this.getMatchingReference(position);
        if(reference) {
            return reference.getCompletionItems(token, context);
        }
    }
    
    public getHover(position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
        const reference = this.getMatchingReference(position);
        if(reference) {
            const strings = reference.getMatchingSymbols().SelectMany(s => s.getHoverString()).ToArray();
            return new vscode.Hover(strings, reference.range)
        }
    }
    
    public getDocumentSymbols(token: vscode.CancellationToken): vscode.DocumentSymbol[] {
        const documentSymbols: vscode.DocumentSymbol[] = [];
        for (const definition of this.childDefinitions) {
            const symbol = definition.symbol;
            const reference = definition.identifierReference;
            const documentSymbol = new vscode.DocumentSymbol(
                symbol.identifier,
                symbol.type.name,
                vscode.SymbolKind.Class,
                definition.range,
                definition.range.contains(reference.range) ? reference.range : definition.range
            );
            documentSymbol.children = definition.getDocumentSymbols(token);
        }
        return documentSymbols;
    }
    
    public getRenameEdits(references: Reference<any>[], newName: string, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
        return references.map(r => new vscode.TextEdit(r.range, newName));
    }
}
