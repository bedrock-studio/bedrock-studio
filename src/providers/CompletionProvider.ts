import * as vscode from 'vscode'

import { getLocation, parse } from 'jsonc-parser'

import { CompletionItemConstructor, CompletionListConstructor } from '../lib/PointOfInterest'
import { getValueAtPath, matchPaths } from './util'
import { pointsOfInterest } from './PointsOfInterest'


export default class BedrockCompletionProvider implements vscode.CompletionItemProvider {
  public async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

    const documentText = document.getText();
    const documentObject = parse(documentText);
    const { path, isAtPropertyKey } = getLocation(documentText, document.offsetAt(position));
    const hasPropertyValue = isAtPropertyKey && typeof getValueAtPath(documentObject, path) !== "undefined";
    const positionRange = document.getWordRangeAtPosition(position);

    for (const item of pointsOfInterest) {
      if (item.isPropertyKey === isAtPropertyKey) {
        const match = matchPaths(path, item.path);
        if (match) {
          const documentData = { document, documentText, documentObject, position, positionPath: path, positionRange, isAtPropertyKey, hasPropertyValue, match }
          const identifiers = await item.provider.getAllIdentifiers(documentData);
          const type = item.completionType;
          if (type.prototype instanceof vscode.CompletionList) {
            return new (type as CompletionListConstructor)(identifiers, documentData);
          }
          else {
            return identifiers.map(identifier => new (type as CompletionItemConstructor)(identifier, documentData));
          }
        }
      }
    }
  }
}
