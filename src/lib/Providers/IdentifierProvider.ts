import * as vscode from 'vscode';

import { DocumentData } from "../DocumentData";

type Async<T> = T | Promise<T>;

export interface Identifier {
    value: string;
    location: vscode.Location;
}

export interface Provider<T = Identifier> {
    getAllIdentifiers(data: DocumentData): Async<Array<T>>;
    getMatchingIdentifiers(name: string, data: DocumentData): Async<Array<T>>;
}

export type IdentifierProvider = Provider;
