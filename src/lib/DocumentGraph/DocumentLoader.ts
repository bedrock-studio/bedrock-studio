import { Project } from '../Project';
import { Document } from './Document';
import { DocumentLoaderType } from './DocumentLoaderType';
import { DocumentType } from "./DocumentType";
export abstract class DocumentLoader<TLoader extends DocumentLoader<TLoader, TDoc, TDocType>, TDoc extends Document<TDoc, TLoader, TDocType>, TDocType extends DocumentType<TDocType, TDoc, TLoader>> {
    public abstract readonly type: DocumentLoaderType<TLoader, TDoc, TDocType>;
    public readonly project: Project;
    public readonly documentTypes: Array<TDocType>;
    constructor(project: Project, documentTypes: Array<TDocType>) {
        this.project = project;
        this.documentTypes = documentTypes;
    }
    public abstract tryLoad(vsdocument: vscode.TextDocument): Document<TDoc, TLoader, TDocType> | null;
}
