import * as vscode from 'vscode';

import { Identifier } from "../Providers";

import { DocumentData } from '../DocumentData';

export class PathCompletion extends vscode.CompletionList {
  constructor(identifiers: Identifier[], { document, position, positionRange, hasPropertyValue }: DocumentData) {

    let partialPath = "";
    if (positionRange) {
      const paritalPathRange = new vscode.Range(
        positionRange?.start.translate(0, 1),
        position
      )
      partialPath = document.getText(paritalPathRange);
    }

    const completions = getPathCompletions(identifiers.map(i => i.value), partialPath, positionRange);
    super(completions, true);
  }
}

function newCompletionItem(props: Partial<vscode.CompletionItem> & { label: string }) {
  return Object.assign(new vscode.CompletionItem(props.label), props) as vscode.CompletionItem;
}

/**
 * Gets completions for a path value. Only the completions for the next path segment are returned.
 * @param paths A list of paths
 * @param existingPath The existing path
 * @param completionRange The completion range
 */
export function getPathCompletions(paths: string[], partialPath: string, completionRange: vscode.Range | undefined) {
  const tree = pathsToTree(paths);
  const parentPathSegments = partialPath.split("/").slice(0, -1);
  const parentPath = parentPathSegments.join("/");
  const parentNode = tree.getPath(parentPathSegments);
  // Remove qoutes from the completion range if needed
  if (completionRange) completionRange = new vscode.Range(
    completionRange.start.translate(0, 1),
    completionRange.end.translate(0, -1),
  )
  if (parentNode) {
    return parentNode.getChildren().map(child => {
      const hasChildren = child.hasChildren();
      const segment = hasChildren ? child.name + "/" : child.name;
      const fullPath = parentPath ? parentPath + "/" + segment : segment;
      return newCompletionItem({
        label: segment,
        kind: hasChildren ? vscode.CompletionItemKind.Folder : vscode.CompletionItemKind.File,
        insertText: completionRange ? fullPath : new vscode.SnippetString(`"${fullPath}$0"`),
        range: completionRange,
        filterText: fullPath
      });
    });
  }
  return [];
}

class PathNode {
  constructor(public name: string) { }
  public parent: PathNode | null = null;
  private children: Record<string, PathNode> = {};
  public getOrCreateChild(name: string) {
    return this.children[name] = this.children[name] || new PathNode(name);
  }
  public hasChildren() {
    return Object.getOwnPropertyNames(this.children).length > 0;
  }
  public getChildren() {
    return Object.getOwnPropertyNames(this.children).map(k => this.children[k]);
  }
  public getPath(path: string[]) {
    var currentLeaf: PathNode = this;
    for (const segment of path) {
      if (segment in currentLeaf.children) currentLeaf = currentLeaf.children[segment];
      else return null;
    }
    return currentLeaf;
  }
}

/**
* Turns a list of paths into a path tree
* @param paths A list of paths
*/
function pathsToTree(paths: string[]): PathNode {
  const tree: PathNode = new PathNode("");
  for (const path of paths) {
    const segments = path.split("/");
    let currentLeaf = tree;
    for (const segment of segments) {
      currentLeaf = currentLeaf.getOrCreateChild(segment);
    }
  }
  return tree;
}