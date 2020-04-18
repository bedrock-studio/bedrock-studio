import { Project } from '../Project';
import { Document } from './Document';
import { DocumentType } from "./DocumentType";
import { DocumentLoader } from "./DocumentLoader";
////////////////////////////////
//      Document Loaders      //
////////////////////////////////
export interface DocumentLoaderType<TLoader extends DocumentLoader<TLoader, TDoc, TDocType>, TDoc extends Document<TDoc, TLoader, TDocType>, TDocType extends DocumentType<TDocType, TDoc, TLoader>> {
    selector: vscode.DocumentSelector;
    build(project: Project, documentTypes: Array<TDocType>): TLoader;
}
