import * as vscode from 'vscode';

import { Document } from './Document';
import { Reference } from './Reference';
import { Project } from '../Project';
import { Scope } from './Scope';
import { Symbol } from './Symbol';
import { Collection } from './Collection';

export class Definition<TDoc extends Document<any, any, any>> {

    /**
     * The project.
     */
    public readonly project: Project;

    /**
     * The parent document.
     */
    public readonly parentDocument: TDoc;

    /**
     * The parent definition, if it exists.
     */
    public readonly parentDefinition?: Definition<TDoc>;

    /**
     * The symbol.
     */
    public readonly symbol: Symbol<any>;

    /**
     * A scope for symbols defined inside this definition
     */
    public readonly scope: Scope = new Scope();

    /**
     * Child definitions
     */
    public readonly childDefinitions: Set<Definition<TDoc>>;

    /**
     * Child references
     */
    public readonly childReferences: Set<Reference<TDoc>>;

    /**
     * The reference that declares the identifier for this definition
     */
    public readonly identifierReference: Reference<TDoc>;

    /**
     * The range in the document.
     */
    public readonly range: vscode.Range;

    /**
     * Creates a new Definition.
     * @param project The project.
     * @param parentDocument The parent document.
     * @param parentDefinition The parent definition.
     * @param identifierReference The identifier reference.
     * @param symbol The symbol.
     */
    constructor(
        project: Project,
        parentDocument: TDoc,
        parentDefinition: Definition<TDoc> | undefined,
        identifierReference: Reference<TDoc>,
        symbol: Symbol<any>,
        range: vscode.Range
    ) {
        this.project = project;
        this.parentDocument = parentDocument;
        this.parentDefinition = parentDefinition;
        this.identifierReference = identifierReference;
        this.symbol = symbol;
        this.range = range;
        this.childDefinitions = new Set();
        this.childReferences = new Set();
        (this.parentDefinition || this.parentDocument).childDefinitions.add(this);
        this.symbol.definitions.add(this);
    }

    /**
     * Destroys all links controlled by this definition or it's children.
     */
    public destroy(): void {
        this.childDefinitions.forEach(d => d.destroy());
        this.childDefinitions.clear();
        this.childReferences.forEach(r => r.destroy());
        this.childReferences.clear();
        (this.parentDefinition || this.parentDocument).childDefinitions.delete(this);
        this.symbol.definitions.delete(this);
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
}
