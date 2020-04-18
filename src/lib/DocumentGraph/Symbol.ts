import * as vscode from "vscode";

import { Collection } from "./Collection";
import { Definition } from "./Definition";
import { Document } from "./Document";
import { Reference } from "./Reference";
import { Scope } from "./Scope";
import { SymbolType } from "./SymbolType";

export abstract class Symbol<T extends Symbol<T>> {
    public abstract readonly type: SymbolType<T>;
    public readonly identifier: string;
    public readonly scope: Scope;
    public readonly definitions: Set<Definition<Document<any, any, any>>>;
    public readonly references: Set<Reference>;
    constructor(scope: Scope, identifier: string) {
        this.scope = scope;
        this.identifier = identifier;
        this.definitions = new Set();
        this.references = new Set();
    }
    public getHoverString(): vscode.MarkedString | vscode.MarkedString[] {
        if(this.definitions.size > 0) {
            return new Collection(this.definitions).Select(d => {
                const mdString = new vscode.MarkdownString();
                mdString.appendText(`[${this.type.label}] ${this.identifier} (${d.parentDocument.document.fileName})`);
                return mdString;
            }).ToArray();
        }
        return new vscode.MarkdownString().appendText(`[${this.type.label}] ${this.identifier}`);
    }
}
