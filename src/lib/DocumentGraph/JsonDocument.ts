import * as vscode from 'vscode';
import { Node as JsonNode } from 'jsonc-parser';

import { Project } from '../Project';
import { Document } from './Document';
import { JsonDocumentLoader } from "./JsonDocumentLoader";
import { JsonDocumentType } from "./JsonDocumentType";

export abstract class JsonDocument<T extends JsonDocument<T>> extends Document<T, JsonDocumentLoader<T>, JsonDocumentType<T>> {
    public abstract readonly type: JsonDocumentType<T> & (new (...params: any[]) => T);
    public readonly root: JsonNode;
    constructor(project: Project, document: vscode.TextDocument, root: JsonNode) {
        super(project, document);
        this.root = root;
    }
}
