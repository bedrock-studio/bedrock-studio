import * as vscode from 'vscode'

import { parse, getLocation } from 'jsonc-parser'

import SharedProvider from './SharedProvider'
import { getValueAtPath, matchPaths } from './util';
import { pointsOfInterest } from './PointsOfInterest';
import { DocumentData } from '../lib/DocumentData';

export default class BedrockDefinitionProvider extends SharedProvider implements vscode.DefinitionProvider {
  public async provideDefinition(document: vscode.TextDocument, position: vscode.Position): Promise<vscode.Location | vscode.Location[] | undefined> {

    const documentText = document.getText();
    const documentObject = parse(documentText);
    const { path, isAtPropertyKey } = getLocation(documentText, document.offsetAt(position));
    const hasPropertyValue = isAtPropertyKey && typeof getValueAtPath(documentObject, path) !== "undefined";
    const positionRange = document.getWordRangeAtPosition(position);

    if (positionRange) {
      const identifier = document.getText(positionRange).slice(1, -1);

      for (const item of pointsOfInterest) {
        if (item.isPropertyKey === isAtPropertyKey) {
          const match = matchPaths(path, item.path);
          if (match) {
            const documentData: DocumentData = { document, documentObject, position, positionPath: path, positionRange, hasPropertyValue, match }
            const identifiers = await item.provider.getMatchingIdentifiers(identifier, documentData);
            return identifiers.map(i => i.location);
          }
        }
      }
    }
  }
}
