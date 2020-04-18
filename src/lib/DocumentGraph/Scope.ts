import { Symbol } from "./Symbol";
import { SymbolType } from "./SymbolType";
import { Collection } from "./Collection";

type SymbolTypeMap<T extends Symbol<T>> = Map<SymbolType<T>, Map<string, T>>;

/**
 * Stores symbols based on their symbol type
 */
export class Scope {
    private readonly source: SymbolTypeMap<any> = new Map();
    private getTypeMap<T extends Symbol<T>>(type: T["type"]): Map<string, T> {
        let map = this.source.get(type);
        if (!map) {
            map = new Map<string, Symbol<any>>();
            this.source.set(type, map);
        }
        return map;
    }
    public getOrCreate<T extends Symbol<T>>(type: T["type"], identifier: string): T {
        const map = this.getTypeMap(type);
        let symbol = map.get(identifier);
        if (!symbol) {
            symbol = new type(this, identifier);
            map.set(identifier, symbol);
        }
        return symbol;
    }
    public getAll<T extends Symbol<T>>(type: T["type"]): Collection<T> {
        return new Collection<T>(this.getTypeMap<T>(type).values());
    }
    public tryGet<T extends Symbol<T>>(type: T["type"], identifier: string): T | undefined {
        return this.source.get(type)?.get(identifier);
    }
}
