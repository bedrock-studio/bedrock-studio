import * as vscode from 'vscode';

import { Node } from 'jsonc-parser';

export type JsonPathSegment = string | number;
export type JsonPath = readonly JsonPathSegment[];

export function isRecord(thing: unknown): thing is Record<any, any> {
    return typeof thing === "object" && thing !== null;
}

export function getValueAtPath<T>(object: Record<string | number, any>, path: Array<string | number>): T {
    let cv = object;
    for (let i = 0; i < path.length && isRecord(cv); cv = cv[path[i++]]);
    return cv as T;
}

export function nodeToRange(document: vscode.TextDocument, node: Node): vscode.Location {
    return new vscode.Location(
        document.uri,
        new vscode.Range(
            document.positionAt(node.offset),
            document.positionAt(node.colonOffset || (node.offset + node.length))
        )
    );
}

export function matchPaths(a: JsonPath, b: JsonPath): null | Record<string, string | number> {
    if (a.length !== b.length) return null;
    const params: Record<string, string | number> = {};
    for (let i = 0; i < a.length; i++) {
        const path = a[i].toString();
        const pathFilter = b[i].toString();
        if (pathFilter === "*") {
            continue;
        }
        else if (pathFilter.startsWith("{") && pathFilter.endsWith("}")) {
            const param = pathFilter.slice(1, -1);
            params[param] = path;
        }
        else if (pathFilter !== path) {
            return null;
        }
    }
    return params;
}

/**
 * Returns a generator that can be used to iterate through all key-value nodes of the given object node.
 * @param node The node
 */
export function* iterateProperties(node: Node): Generator<[Node, Node], void, void> {
    if (node.type === "object" && node.children) {
        for (const propertyNode of node.children) {
            if (propertyNode.type === "property" && propertyNode.children && propertyNode.children.length === 2) {
                yield propertyNode.children as [Node, Node];
            }
        }
    }
}

export type NodeMatch = [JsonPath, Record<string, string | number>, Node]

export function getMatchingNodes(root: Node, path: JsonPath): NodeMatch[] {
    let searchNodes: NodeMatch[] = [[[], {}, root]];
    for (const segment of path) {
        const newSearchNodes: NodeMatch[] = [];
        for (const [path, match, node] of searchNodes) {
            if (node.type === "array" && node.children) {
                if (typeof segment === "number") {
                    newSearchNodes.push([[...path, segment], match, node.children[segment]]);
                }
                else if (segment === "*") {
                    node.children.forEach((n, i) => newSearchNodes.push([[...path, i], match, n]));
                }
                else if (segment.startsWith("{") && segment.endsWith("}")) {
                    const param = segment.slice(1, -1);
                    node.children.forEach((n, i) => newSearchNodes.push([[...path, i], { ...match, [param]: i }, n]));
                }
            }
            else if (node.type === "object" && node.children) {
                for (const [keyNode, valueNode] of iterateProperties(node)) {
                    if (segment === keyNode.value || segment === "*") {
                        newSearchNodes.push([[...path, segment], match, valueNode]);
                    }
                    else if (typeof segment === "string" && segment.startsWith("{") && segment.endsWith("}")) {
                        const param = segment.slice(1, -1);
                        newSearchNodes.push([[...path, segment], { ...match, [param]: keyNode.value }, valueNode]);
                    }

                }
            }
        }
        searchNodes = newSearchNodes;
    }
    return searchNodes;
}

/**
 * Compares the properties of two objects.
 *
 * Return values:
 * - `true` - All properties are identical
 * - `-1` - `a` has extra properties, but is otherwise identical
 * - `0` - `a` and `b` have extra properties, but are otherwise identical
 * - `1` - `b` has extra properties, but is otherwise identical
 * - `false` - Not all properties are identical
 * @param a The first match
 * @param b The second match
 */
export function compareMatches(a: Record<string, string | number>, b: Record<string, string | number>): boolean | number {
    const aKeys = Object.getOwnPropertyNames(a);
    const bKeys = Object.getOwnPropertyNames(b);
    const allKeys = new Set([...aKeys, ...bKeys]);
    let aHasExtra = false;
    let bHasExtra = false;
    for (const key of allKeys) {
        const aValue = a[key];
        const bValue = b[key];
        if (typeof aValue === 'undefined') {
            if (typeof bValue === 'undefined') {
                continue;
            }
            else {
                bHasExtra = true;
            }
        }
        else {
            if (typeof bValue === 'undefined') {
                aHasExtra = true;
            }
            else {
                if (aValue !== bValue) {
                    return false;
                }
            }
        }
    }
    if (aHasExtra && bHasExtra) return 0;
    if (aHasExtra) return -1;
    if (bHasExtra) return 1;
    return true;
}
