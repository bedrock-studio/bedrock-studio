import * as vscode from 'vscode';

export class CustomCompletion extends vscode.CompletionItem {
    constructor(init: Partial<vscode.CompletionItem> & { label: string }) {
      if(init instanceof vscode.CompletionItem) return init;
      super(init.label);
      Object.assign(this, init);
    }
  }