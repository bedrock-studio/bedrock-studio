import { DocumentType } from './DocumentType';
import { RawDocumentLoader } from './RawDocumentLoader';
import { RawDocument } from "./RawDocument";

export interface RawDocumentType<T extends RawDocument<T>> extends DocumentType<RawDocumentType<T>, T, RawDocumentLoader> {
}
