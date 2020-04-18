export class Collection<T> implements Iterable<T> {
    constructor(private source: Iterable<T>) { }
    public *[Symbol.iterator]() {
        yield* this.source;
    }
    public Where(predicate: (value: T) => boolean): Collection<T>;
    public Where<U extends T>(predicate: (value: T) => value is U): Collection<U>;
    public Where(predicate: (value: T) => boolean) {
        return new Collection(this.WhereImpl(predicate));
    }
    private *WhereImpl(predicate: (value: T) => boolean) {
        for (const value of this.source) {
            if (predicate(value)) yield value;
        }
    }
    public Select<U>(predicate: (value: T) => U) {
        return new Collection(this.SelectImpl(predicate));
    }
    public *SelectImpl<U>(predicate: (value: T) => U) {
        for (const value of this.source) {
            yield predicate(value);
        }
    }
    public SelectAsync<U>(predicate: (value: T) => Promise<U>) {
        return new AsyncCollection(this.SelectAsyncImpl(predicate));
    }
    public async *SelectAsyncImpl<U>(predicate: (value: T) => Promise<U>) {
        for (const value of this.source) {
            yield await predicate(value);
        }
    }
    public SelectMany<U>(predicate: (value: T) => U | Iterable<U>) {
        return new Collection(this.SelectManyImpl(predicate));
    }
    public *SelectManyImpl<U>(predicate: (value: T) => U | Iterable<U>) {
        for (const value of this.source) {
            const selectedValue = predicate(value);
            if (Symbol.iterator in selectedValue) {
                yield* selectedValue as Iterable<U>;
            } else {
                yield selectedValue as U;
            }
        }
    }
    public SelectManyAsync<U>(predicate: (value: T) => Promise<U | Iterable<U>>) {
        return new AsyncCollection(this.SelectManyAsyncImpl(predicate));
    }
    public async *SelectManyAsyncImpl<U>(predicate: (value: T) => Promise<U | Iterable<U>>) {
        for (const value of this.source) {
            const selectedValue = await predicate(value);
            if (Symbol.iterator in selectedValue) {
                yield* selectedValue as Iterable<U>;
            } else {
                yield selectedValue as U;
            }
        }
    }
    public GroupBy<U>(predicate: (value: T) => U) {
        return new Collection(this.GroupByImpl(predicate));
    }
    public *GroupByImpl<U>(predicate: (value: T) => U) {
        const map = new Map<U, T[]>();
        for (const value of this.source) {
            const key = predicate(value);
            const values = map.get(key);
            if (values) values.push(value);
            else map.set(key, [value]);
        }
        yield* map;
    }
    public OfType<U extends T>(type: new (...params: any[]) => U) {
        return this.Where((value: unknown): value is U => value instanceof type);
    }
    public ToMap<U>(predicate: (value: T) => U) {
        const map = new Map<U, T>();
        for (const value of this.source) {
            const key = predicate(value);
            map.set(key, value);
        }
        return map;
    }
    public ToArray() {
        return [...this.source];
    }
    public Any(predicate: (value: T) => boolean) {
        for (const value of this.source) {
            if (predicate(value)) return true;
        }
        return false;
    }
    public Distinct() {
        return new Collection(new Set(this.source));
    }
    public Traverse(predicate: (value: T) => Iterable<T>) {
        return new Collection(this.TraverseImpl(predicate));
    }
    public *TraverseImpl(predicate: (value: T) => Iterable<T>) {
        var stack: Array<Iterable<T>> = [];
        stack.push(this.source);
        while (stack.length > 0) {
            var current = stack.pop()!;
            yield current;
            for (var child of current)
                stack.push(predicate(child));
        }
    }
}

export class AsyncCollection<T> implements AsyncIterable<T> {
    constructor(private source: AsyncIterable<T>) { }
    public async *[Symbol.asyncIterator]() {
        yield* this.source;
    }
    public Where(predicate: (value: T) => boolean): AsyncCollection<T>;
    public Where<U extends T>(predicate: (value: T) => value is U): AsyncCollection<U>;
    public Where(predicate: (value: T) => boolean) {
        return new AsyncCollection(this.WhereImpl(predicate));
    }
    private async *WhereImpl(predicate: (value: T) => boolean) {
        for await (const value of this.source) {
            if (predicate(value)) yield value;
        }
    }
    public Select<U>(predicate: (value: T) => U) {
        return new AsyncCollection(this.SelectImpl(predicate));
    }
    public async *SelectImpl<U>(predicate: (value: T) => U) {
        for await (const value of this.source) {
            yield predicate(value);
        }
    }
    public SelectMany<U>(predicate: (value: T) => U | Iterable<U>) {
        return new AsyncCollection(this.SelectManyImpl(predicate));
    }
    public async *SelectManyImpl<U>(predicate: (value: T) => U | Iterable<U>) {
        for await (const value of this.source) {
            const selectedValue = predicate(value);
            if (Symbol.iterator in selectedValue) {
                yield* selectedValue as Iterable<U>;
            } else {
                yield selectedValue as U;
            }
        }
    }
    public GroupBy<U>(predicate: (value: T) => U) {
        return new AsyncCollection(this.GroupByImpl(predicate));
    }
    public async *GroupByImpl<U>(predicate: (value: T) => U) {
        const map = new Map<U, T[]>();
        for await (const value of this.source) {
            const key = predicate(value);
            const values = map.get(key);
            if (values) values.push(value);
            else map.set(key, [value]);
        }
        yield* map;
    }
    public async ToMap<U>(predicate: (value: T) => U) {
        const map = new Map<U, T>();
        for await (const value of this.source) {
            const key = predicate(value);
            map.set(key, value);
        }
        return map;
    }
    public async ToArray() {
        const array: T[] = [];
        for await (const value of this.source) {
            array.push(value);
        }
        return array;
    }
    public async Any(predicate: (value: T) => boolean) {
        for await (const value of this.source) {
            if (predicate(value)) return true;
        }
        return false;
    }
}
