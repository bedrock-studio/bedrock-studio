import * as vscode from 'vscode';

import { Definition } from "./Definition";
import { Document } from './Document';
import { Project } from '../Project';
import { Symbol } from './Symbol';
import { Collection } from './Collection';

export abstract class Reference<TDoc extends Document<any, any, any> = Document> {

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
     * The range in the document.
     */
    public readonly range: vscode.Range;

    /**
     * Creates a new Reference.
     * @param project The project.
     * @param parentDocument The parent document.
     * @param parentDefinition The parent definition.
     * @param range The range.
     */
    constructor(project: Project, parentDocument: TDoc, parentDefinition: Definition<TDoc> | undefined, range: vscode.Range) {
        this.project = project;
        this.parentDocument = parentDocument;
        this.parentDefinition = parentDefinition;
        this.range = range;
        (this.parentDefinition || this.parentDocument).childReferences.add(this);
    }
    
    /**
     * Destroys all links controlled by this reference.
     */
    public destroy() {
        (this.parentDefinition || this.parentDocument).childReferences.delete(this);
    }

    /**
     * Gets completion items for this reference.
     * @param token The cancellation token.
     * @param context The completion context.
     */
    public abstract getCompletionItems(token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList>;

    /**
     * Gets any symbols that this reference resolves to.
     */
    public abstract getMatchingSymbols(): Collection<Symbol<any>>;

    /**
     * Ensures that any symbol references are resolved and reports any that could not be properly resolved.
     */
    public abstract ensureResolved(): void;
}
