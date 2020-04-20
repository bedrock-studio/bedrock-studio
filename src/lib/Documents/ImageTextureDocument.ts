import * as vscode from "vscode";

import { Project } from '../Project';
import { RawDocument, RawDocumentLoader } from "../DocumentGraph";

export class ImageTextureDocument extends RawDocument<ImageTextureDocument> {

    public static readonly filePathFilter = ["/textures/**/*.png", "/textures/**/*.tga"];
    public static readonly documentLoader = RawDocumentLoader;
    public static tryLoad(project: Project, document: vscode.TextDocument): ImageTextureDocument {
        return new ImageTextureDocument(project, document);
    }

    public readonly type = ImageTextureDocument;
    constructor(project: Project, document: vscode.TextDocument) {
        super(project, document);
    }

}
