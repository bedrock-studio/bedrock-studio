import { findNodeAtLocation, Node } from 'jsonc-parser';

import { iterateProperties } from "../util";
import { Document, Project, JsonDefinition, JsonReference, Scope } from '../DocumentGraph';
import { AnimationControllerSymbol, AnimationControllerStateSymbol, ClientEntitySymbol } from '../Symbols';
import { AnimationControllerNicknameDefinition } from "./AnimationControllerNicknameDefinition";

export class AnimationControllerStateDefinition extends JsonDefinition {
    constructor(project: Project, document: Document, parent: JsonDefinition, symbol: AnimationControllerSymbol, node: Node) {
        super(project, document, parent, symbol, node);

        // For each animation
        const animationsNode = findNodeAtLocation(this.node, ["animations"]);
        if (animationsNode) {
            if (animationsNode.type === "array" && animationsNode.children) {
                for (const child of animationsNode.children) {
                    // Record the animation reference
                    const animationRef = new JsonReference(this.project, this.parentDocument, this, child);
                    () => {
                        // Get any entity which references this animation controller
                        return this.project.scope.getAll(ClientEntitySymbol)
                            .Where(s => s.definitions
                                .OfType(AnimationControllerNicknameDefinition)
                                .Any(d => d.references.Any(r => r.resolve().includes(this.symbol))));
                    };
                }
            }
        }
        // For each transition
        const transitionsNode = findNodeAtLocation(this.node, ["transitions"]);
        if (transitionsNode) {
            if (transitionsNode.type === "array" && transitionsNode.children) {
                for (const child of transitionsNode.children) {
                    for (const [keyNode, valueNode] of iterateProperties(child)) {
                        // Record the state reference
                        const stateRef = new JsonReference(this.project, this, keyNode, () => this.parent.scope.getOrCreate(AnimationControllerStateSymbol, keyNode.value));
                        this.childReferences.add(stateRef);
                        // Record the molang definition
                        const molangDef = new MolangDefinition(this.project, this.document, this);
                    }
                }
            }
        }
    }
}
