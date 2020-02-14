import * as vscode from 'vscode';

import { Identifier } from "../Providers";

import { DocumentData } from '../DocumentData';

export class PropertyCompletion extends vscode.CompletionItem {
  constructor(identifier: Identifier, { hasPropertyValue }: DocumentData) {
    super(identifier.value);
    this.kind = vscode.CompletionItemKind.Property;
    if (hasPropertyValue) {
      this.insertText = `"${identifier.value}"`;
    }
    else {
      this.insertText = `"${identifier.value}": `;
    }
    this.filterText = `"${identifier.value}"`;
  }
}