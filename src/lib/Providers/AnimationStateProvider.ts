import * as vscode from 'vscode'

import { DocumentData } from "../DocumentData";
import { getValueAtPath } from "../../providers/util";
import { IdentifierProvider } from "./IdentifierProvider";

export class AnimationStateProvider implements IdentifierProvider {
    getAllIdentifiers({ document, documentObject, match }: DocumentData) {
      const statesObject = getValueAtPath(documentObject, ["animation_controllers", match.controller, "states"]);
      const availableStates = statesObject ? Object.getOwnPropertyNames(statesObject) : [];
      return availableStates.map(state => ({
        value: state,
        location: new vscode.Location(document.uri, document.positionAt(0))
      }));
    }
    getMatchingIdentifiers(name: string, _: DocumentData) {
      return [];
    }
  }
  