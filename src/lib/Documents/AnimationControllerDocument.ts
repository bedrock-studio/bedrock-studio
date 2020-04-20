import * as vscode from "vscode";
import { Node, findNodeAtLocation } from 'jsonc-parser';

import { Project, JsonDocument, JsonDocumentLoader, JsonReference } from '../DocumentGraph';
import { iterateProperties } from "../util";

import { AnimationControllerSymbol } from "../Symbols";
import { AnimationControllerDefinition } from "../Definitions";

export class AnimationControllerDocument extends JsonDocument<AnimationControllerDocument> {

    public static readonly filePathFilter = ["/animation_controllers/*.json", "/*.animation_controllers.json"];
    public static readonly jsonPathFilter = [["animation_controllers"]];
    public static readonly documentLoader = JsonDocumentLoader;
    public static tryLoad(project: Project, document: vscode.TextDocument, root: Node): AnimationControllerDocument {
        return new AnimationControllerDocument(project, document, root);
    }

    public readonly type = AnimationControllerDocument;
    constructor(project: Project, document: vscode.TextDocument, root: Node) {
        super(project, document, root);
        this.parseContent();
    }

    private parseContent(): void {

        // Get the animation controllers list
        const controllersNode = findNodeAtLocation(this.root, ["animation_controllers"]);
        if (controllersNode) {

            // For each animation controller
            for (const [keyNode, valueNode] of iterateProperties(controllersNode)) {

                // Get or create a symbol for it
                const defSymbol = this.project.scope.getOrCreate(AnimationControllerSymbol, keyNode.value);

                // Record the reference that identifies it
                this.childReferences.add(new JsonReference(this.project, this, undefined, keyNode, () => defSymbol));

                // Record the definition for it
                this.childDefinitions.add(new AnimationControllerDefinition(this.project, this, defSymbol, valueNode));

            }

        }

    }

}
