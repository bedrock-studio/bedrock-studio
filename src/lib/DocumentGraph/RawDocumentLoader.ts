import * as vscode from 'vscode';

import { Project } from '../Project';
import { Document } from './Document';
import { DocumentLoader } from './DocumentLoader';
import { DocumentType } from './DocumentType';
export class RawDocumentLoader extends DocumentLoader<RawDocumentLoader, Document<any, RawDocumentLoader, any>, DocumentType<any, any, RawDocumentLoader>> {
    public static selector = { pattern: "*" };
    public static build(project: Project, documentTypes: Array<DocumentType<any, Document<any, RawDocumentLoader, any>, RawDocumentLoader>>) {
        return new RawDocumentLoader(project, documentTypes);
    }
    ;
    public readonly type = RawDocumentLoader;
    constructor(project: Project, documentTypes: Array<DocumentType<any, Document<any, RawDocumentLoader, any>, RawDocumentLoader>>) {
        super(project, documentTypes);
    }
    public tryLoad(vsdocument: vscode.TextDocument): Document<any, RawDocumentLoader, any> | null {
        // Get the possible types based on file name
        const possibleTypes = this.documentTypes.filter(t => t.filePathFilter.some(pattern => vscode.languages.match({ pattern }, vsdocument)));
        // Try each document
        for (const type of possibleTypes) {
            const document = type.tryLoad(this.project, vsdocument);
            if (document)
                return document;
        }
        return null;
    }
}
