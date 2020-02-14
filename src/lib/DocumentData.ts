import * as vscode from 'vscode'

import { JSONPath } from 'jsonc-parser';

export interface DocumentData {
    document: vscode.TextDocument;
    documentObject: object;
    position: vscode.Position;
    positionPath: JSONPath;
    positionRange: vscode.Range | undefined;
    hasPropertyValue: boolean;
    match: Record<string, string | number>;
}
