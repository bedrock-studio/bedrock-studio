import { Project } from './Project';
import { ClientEntityJsonDocument } from '../Documents/ClientEntityDocument';
import { Symbol } from '../DocumentGraph/Symbol';
import { Definition } from './Definition';
export class AnimationControllerNicknameDefinition extends Definition<ClientEntityJsonDocument> {
    constructor(project: Project, parentDocument: ClientEntityJsonDocument, parentDefinition?: Definition<ClientEntityJsonDocument>, symbol: Symbol<any>) {
        super(project, parentDocument, parentDefinition, symbol);
    }
}
