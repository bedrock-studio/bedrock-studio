import * as vscode from 'vscode';

import { Project } from '../Project';
import { Document } from './Document';
import { RawDocumentLoader } from './RawDocumentLoader';
import { RawDocumentType } from './RawDocumentType';
export abstract class RawDocument<T extends RawDocument<T>> extends Document<T, RawDocumentLoader, RawDocumentType<T>> {
    public abstract readonly type: RawDocumentType<T> & (new (...params: any[]) => T);
    constructor(project: Project, document: vscode.TextDocument) {
        super(project, document);
    }
}
