import * as vscode from 'vscode'

import { JSONPath } from 'jsonc-parser';

export interface DocumentData {
    document: vscode.TextDocument;
    documentText: string;
    documentObject: object;
    position: vscode.Position;
    positionPath: JSONPath;
    positionRange: vscode.Range | undefined;
    isAtPropertyKey: boolean;
    hasPropertyValue: boolean;
    match: Record<string, string | number>;
}
