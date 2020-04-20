import * as vscode from "vscode";

import { Node as JsonNode } from 'jsonc-parser';
import { Project } from '../Project';
import { JsonDocument, JsonDocumentLoader } from "../DocumentGraph";

export class ClientEntityDocument extends JsonDocument<ClientEntityDocument> {

    public static readonly filePathFilter = ["/*.entity.json"];
    public static readonly jsonPathFilter = [["minecraft:client_entity"]];
    public static readonly documentLoader = JsonDocumentLoader;
    public static tryLoad(project: Project, document: vscode.TextDocument, root: JsonNode): ClientEntityDocument {
        return new ClientEntityDocument(project, document, root);
    }

    public readonly type = ClientEntityDocument;
    constructor(project: Project, document: vscode.TextDocument, root: JsonNode) {
        super(project, document, root);
    }

}
