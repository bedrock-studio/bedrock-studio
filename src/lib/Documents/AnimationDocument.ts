import * as vscode from "vscode";

import { Node as JsonNode } from 'jsonc-parser';
import { Project } from '../Project';
import { JsonDocument, JsonDocumentLoader } from "../DocumentGraph";

export class AnimationDocument extends JsonDocument<AnimationDocument> {

    public static readonly filePathFilter = ["/*.entity.json"];
    public static readonly jsonPathFilter = [["minecraft:client_entity"]];
    public static readonly documentLoader = JsonDocumentLoader;
    public static tryLoad(project: Project, document: vscode.TextDocument, root: JsonNode) {
        return new AnimationDocument(project, document, root);
    }

    public readonly type = AnimationDocument;
    constructor(project: Project, document: vscode.TextDocument, root: JsonNode) {
        super(project, document, root);
    }

}
