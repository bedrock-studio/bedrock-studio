import * as vscode from 'vscode';
import { Node as JsonNode, JSONPath } from 'jsonc-parser';

import { Project } from '../Project';
import { JsonDocument } from './JsonDocument';
import { JsonDocumentLoader } from "./JsonDocumentLoader";
import { DocumentType } from "./DocumentType";

export interface JsonDocumentType<T extends JsonDocument<T>> extends DocumentType<JsonDocumentType<T>, T, JsonDocumentLoader<T>> {
    readonly jsonPathFilter: JSONPath[];
    tryLoad(project: Project, document: vscode.TextDocument, root: JsonNode): JsonDocument<T>;
}
