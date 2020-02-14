import * as vscode from 'vscode';

import { Identifier } from "../Providers";

export class StringCompletion extends vscode.CompletionItem {
    constructor(identifier: Identifier) {
      super(identifier.value);
      this.insertText = this.filterText = `"${identifier.value}"`;
      this.kind = vscode.CompletionItemKind.Value;
    }
  }