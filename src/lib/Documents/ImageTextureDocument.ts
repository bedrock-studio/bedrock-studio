import * as vscode from "vscode";

import { Project } from '../Project';
import { RawDocument, RawDocumentType, RawDocumentLoader } from "../DocumentGraph";

class ImageTextureDocument extends RawDocument<ImageTextureDocument> {
    public static readonly filePathFilter = ["/textures/**/*.png", "/textures/**/*.tga"];
    public static readonly documentLoader = RawDocumentLoader;
    public static tryLoad(project: Project, document: vscode.TextDocument) {
        return new ImageTextureDocument(project, document);
    }
    public readonly type = ImageTextureDocument;

    constructor(project: Project, document: vscode.TextDocument) {
        super(project, document);
    }

    public provideCompletionItems(position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
        return;
    }
    
}
