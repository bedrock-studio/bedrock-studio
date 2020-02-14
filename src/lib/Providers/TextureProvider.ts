import * as vscode from 'vscode'
import * as path from 'path'

import { DocumentData } from "../DocumentData";
import { IdentifierProvider, Identifier } from "./IdentifierProvider";

export class TextureProvider implements IdentifierProvider {
  async getAllIdentifiers({ document }: DocumentData): Promise<Identifier[]> {
    return (await vscode.workspace.findFiles('**/textures/**/*.{png,tga}'))
      .map(file => uriToIdentifier(document.uri, file))
      .filter((x): x is Identifier => !!x);
  }
  async getMatchingIdentifiers(name: string, data: DocumentData) {
    return (await this.getAllIdentifiers(data)).filter(id => id.value === name);
  }
}

function uriToIdentifier(documentUri: vscode.Uri, fileUri: vscode.Uri): Identifier | null {
  const texturePath = fileUri.path
  const relativePath = path.relative(documentUri.path, texturePath)
  const pathParts = /^(.+\.\/)+(.*)\.(png|tga)$/g.exec(relativePath)

  if (pathParts && pathParts.length === 4) {
    const texturePath = pathParts[2]
    return {
      value: texturePath,
      location: new vscode.Location(fileUri, new vscode.Position(0, 0))
    }
  }

  return null;
}
