import { Node } from 'jsonc-parser';
import { Project } from '../Project';
import { JsonDocument } from './lib/JsonDocument';
import { Symbol } from './lib/Symbol';
import { Definition } from './Definition';
export class JsonDefinition extends Definition<JsonDocument<any>> {
    public node: Node;
    constructor(project: Project, parentDocument: JsonDocument<any>, parentDefinition?: JsonDefinition, symbol: Symbol<any>, node: Node) {
        super(project, parentDocument, parentDefinition, symbol);
        this.node = node;
    }
}
