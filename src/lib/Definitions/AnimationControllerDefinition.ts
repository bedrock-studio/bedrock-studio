import { findNodeAtLocation, Node } from 'jsonc-parser';
import { iterateProperties } from "../util";
import { AnimationControllerDocument } from '../Documents';
import { JsonDefinition, JsonReference, Project, Symbol } from '../DocumentGraph';
import { AnimationControllerStateSymbol } from '../Symbols/AnimationControllerStateSymbol';
import { AnimationControllerStateDefinition } from "./AnimationControllerStateDefinition";

/**
 * An Animation Controller
 */
export class AnimationControllerDefinition extends JsonDefinition {

    /**
     * Creates a new Animation Controller
     * @param project The project.
     * @param document The document.
     * @param symbol The symbol.
     * @param node The node.
     */
    constructor(project: Project, document: AnimationControllerDocument, symbol: Symbol<any>, node: Node) {
        super(project, document, undefined, symbol, node);
        this.parseNodeData(node);
    }

    /**
     * Parses definitions and references from the json node
     * @param node The node.
     */
    private parseNodeData(node: Node) {

        // AnimationController.initial_state
        const initialStateNode = findNodeAtLocation(this.node, ["initial_state"]);
        if (initialStateNode) {
            this.childReferences.add(new JsonReference(this.project, this.parentDocument, this, initialStateNode, () => this.scope.getOrCreate(AnimationControllerStateSymbol, initialStateNode.value)));

        }

        // AnimationController.states
        const statesNode = findNodeAtLocation(this.node, ["states"]);
        if (statesNode) {
            for (const [keyNode, valueNode] of iterateProperties(statesNode)) {

                // Get or create a symbol for it
                const defSymbol = this.scope.getOrCreate(AnimationControllerStateSymbol, keyNode.value);

                // Record the reference that identifies it
                const idRef = new JsonReference(this.project, this, keyNode, () => defSymbol);
                this.childReferences.add(idRef);

                // Record the definition for it
                const def = new AnimationControllerStateDefinition(this.project, this.parentDocument, this, defSymbol, valueNode);
                this.childDefinitions.add(def);

            }
        }

    }
    
}
