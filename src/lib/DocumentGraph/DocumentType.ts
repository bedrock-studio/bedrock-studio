import * as vscode from 'vscode';

import { Project } from '../Project';
import { Document } from './Document';
import { DocumentLoaderType } from './DocumentLoaderType';
import { DocumentLoader } from './DocumentLoader';

export interface DocumentType<TDocType extends DocumentType<TDocType, TDoc, TLoader>, TDoc extends Document<TDoc, TLoader, TDocType>, TLoader extends DocumentLoader<TLoader, TDoc, TDocType>> {
    readonly filePathFilter: string[];
    readonly documentLoader: DocumentLoaderType<TLoader, TDoc, TDocType> & (new (...params: any[]) => TLoader);
    tryLoad(project: Project, document: vscode.TextDocument, ...extras: any[]): Document<TDoc, TLoader, TDocType>;
}
