import { DocumentType } from './DocumentType';
import { RawDocumentLoader } from './RawDocumentLoader';
import { RawDocument } from "./RawDocument";
/////////////////////////////
//      Raw Documents      //
/////////////////////////////
export interface RawDocumentType<T extends RawDocument<T>> extends DocumentType<RawDocumentType<T>, T, RawDocumentLoader> {
}
