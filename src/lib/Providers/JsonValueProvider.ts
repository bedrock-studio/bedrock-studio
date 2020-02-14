import * as vscode from 'vscode';

import { JSONPath, parseTree, getNodeValue } from "jsonc-parser";

import { IdentifierProvider, Identifier } from "./IdentifierProvider";
import { nodeToRange, getMatchingNodes, compareMatches } from '../../providers/util';
import { DocumentData } from '../DocumentData';

export class JsonValueProvider implements IdentifierProvider {
    public files: vscode.GlobPattern = "**/*.json";
    public path!: JSONPath;
    constructor(init: Partial<JsonValueProvider> & { path: JSONPath }) {
      Object.assign(this, init);
    }
    public async getAllIdentifiers({ match }: DocumentData) {
      const identifiers: Identifier[] = [];
      const files = await vscode.workspace.findFiles(this.files);
      for (const file of files) {
        const document = await vscode.workspace.openTextDocument(file);
        const documentTree = parseTree(document.getText());
        const nodeMatches = getMatchingNodes(documentTree, this.path);
        for (const [path, nodeMatch, node] of nodeMatches) {
          if(compareMatches(nodeMatch, match) !== false) {
            identifiers.push({
              value: getNodeValue(node),
              location: nodeToRange(document, node)
            });
          }
        }
      }
      return identifiers;
    }
    public async getMatchingIdentifiers(name: string, data: DocumentData) {
      return (await this.getAllIdentifiers(data)).filter(id => id.value === name);
    }
  }
  