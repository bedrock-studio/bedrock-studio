import { Symbol } from './Symbol';
import { Scope } from './Scope';

export interface SymbolType<T extends Symbol<T>> {
    label: string;
    description: string;
    helpUrl?: string;
    new(scope: Scope, identifier: string): T;
}
