import * as vscode from 'vscode';
import { Node } from 'jsonc-parser';

import { Project } from '../Project';
import { JsonDocument } from './JsonDocument';
import { Symbol } from './Symbol';
import { Definition } from './Definition';
import { Reference } from './Reference';

export class JsonDefinition extends Definition<JsonDocument<any>> {
    public node: Node;
    constructor(project: Project, parentDocument: JsonDocument<any>, parentDefinition?: JsonDefinition, identifierReference: Reference, symbol: Symbol<any>, node: Node) {
        super(project, parentDocument, parentDefinition, identifierReference, symbol, range);
        this.node = node;
    }
}
