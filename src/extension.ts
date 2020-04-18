import * as vscode from 'vscode';

import { Project } from './lib/Project';

const jsonFileSelector = [
  { scheme: 'file', language: 'json' },
  { scheme: 'file', language: 'jsonc' }
];

export function activate(context: vscode.ExtensionContext) {

  const project = new Project();

  context.subscriptions.push(vscode.languages.registerCompletionItemProvider(jsonFileSelector, project, '.', ':', '/'));
  context.subscriptions.push(vscode.languages.registerHoverProvider(jsonFileSelector, project));
  context.subscriptions.push(vscode.languages.registerDefinitionProvider(jsonFileSelector, project));
  context.subscriptions.push(vscode.languages.registerReferenceProvider(jsonFileSelector, project));
  context.subscriptions.push(vscode.languages.registerDocumentHighlightProvider(jsonFileSelector, project));
  context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(jsonFileSelector, project));
  context.subscriptions.push(vscode.languages.registerRenameProvider(jsonFileSelector, project));

}

export function deactivate() { }
