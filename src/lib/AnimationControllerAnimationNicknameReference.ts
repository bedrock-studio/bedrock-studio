import { Node as JsonNode } from 'jsonc-parser';

import { AnimationControllerNicknameDefinition } from "./Definitions";
import { Definition, JsonDocument, JsonReference, Collection } from './DocumentGraph';
import { Project } from './Project';
import { AnimationControllerSymbol, ClientEntitySymbol, AnimationNicknameSymbol } from './Symbols';

class AnimationControllerAnimationNicknameReference extends JsonReference {
    private animationControllerSymbol: AnimationControllerSymbol;
    constructor(project: Project, document: JsonDocument<any>, definition: Definition<JsonDocument<any>>, node: JsonNode, animationControllerSymbol: AnimationControllerSymbol) {
        super(project, document, definition, node);
        this.animationControllerSymbol = animationControllerSymbol;
    }
    public resolve(): Collection<AnimationNicknameSymbol> {
        return this.getScopes().Select(s => s.tryGet(AnimationNicknameSymbol, this.node.value)).Where<AnimationNicknameSymbol>((s): s is AnimationNicknameSymbol => !!s);
    }
    public getScopes(): Collection<Scope> {
        return this.project.scope.getAll(ClientEntitySymbol)
            .Where(s => new Collection(s.definitions)
                .OfType(AnimationControllerNicknameDefinition)
                .Any(d => new Collection(d.references)
                    .Any(r => r.resolve().Contains(this.animationControllerSymbol))))
            .Select(s => s.scope);
    }
}
