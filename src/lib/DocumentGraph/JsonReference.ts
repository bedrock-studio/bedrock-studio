import { Node } from 'jsonc-parser';
import { Project } from '../Project';
import { JsonDocument } from './JsonDocument';
import { Symbol } from './Symbol';
import { Reference } from './Reference';
import { Definition } from "./Definition";
export class JsonReference extends Reference<JsonDocument<any>> {
    public node: Node;
    constructor(project: Project, document: JsonDocument<any>, definition: Definition<JsonDocument<any>>, node: Node) {
        super(project, document, definition);
        this.node = node;
    }
}
