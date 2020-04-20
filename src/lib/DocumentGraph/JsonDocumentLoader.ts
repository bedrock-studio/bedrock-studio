import { parseTree, ParseError, findNodeAtLocation } from 'jsonc-parser';
import { Project } from '../Project';
import { JsonDocument } from './JsonDocument';
import { JsonDocumentType } from './JsonDocumentType';
import { DocumentLoader } from './DocumentLoader';

export class JsonDocumentLoader<TDoc extends JsonDocument<TDoc>> extends DocumentLoader<JsonDocumentLoader<TDoc>, TDoc, JsonDocumentType<TDoc>> {
    public static selector = "json";
    public static build<T extends JsonDocument<T>>(project: Project, documentTypes: Array<JsonDocumentType<T>>) {
        return new JsonDocumentLoader(project, documentTypes);
    }
    ;
    public readonly type = JsonDocumentLoader;
    constructor(project: Project, documentTypes: Array<JsonDocumentType<TDoc>>) {
        super(project, documentTypes);
    }
    public tryLoad(vsdocument: vscode.TextDocument): JsonDocument<TDoc> | null {
        // Get the possible types based on file name
        const possibleTypes = this.documentTypes.filter(t => t.filePathFilter.some(pattern => vscode.languages.match({ pattern }, vsdocument)));
        if (possibleTypes.length === 0)
            return null;
        // Parse the document
        const documentText = vsdocument.getText();
        const parseErrors: ParseError[] = [];
        const documentNode = parseTree(documentText, parseErrors, {
            allowEmptyContent: false,
            allowTrailingComma: true,
            disallowComments: false
        });
        // Try each document
        for (const type of possibleTypes) {
            if (type.jsonPathFilter.some(filter => findNodeAtLocation(documentNode, filter))) {
                const document = type.tryLoad(this.project, vsdocument, documentNode);
                if (document)
                    return document;
            }
        }
        return null;
    }
}
