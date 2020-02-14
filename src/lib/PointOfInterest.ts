import * as vscode from 'vscode';

import { JSONPath } from "jsonc-parser";

import { DocumentData } from "./DocumentData";
import { Identifier, Provider } from './Providers';

export type CompletionItemConstructor<T = Identifier> = new (item: T, data: DocumentData) => vscode.CompletionItem;
export type CompletionListConstructor<T = Identifier> = new (items: T[], data: DocumentData) => vscode.CompletionList;

export class PointOfInterest<T> {
    public path!: JSONPath;
    public isPropertyKey!: boolean;
    public completionType!: CompletionItemConstructor<T> | CompletionListConstructor<T>;
    public provider!: Provider<T>;
    public constructor(init: PointOfInterest<T>) {
        Object.assign(this, init);
    }
}
