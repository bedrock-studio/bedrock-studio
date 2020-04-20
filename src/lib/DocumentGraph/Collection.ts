/* eslint-disable @typescript-eslint/no-use-before-define */

export class Collection<T> implements Iterable<T> {

    constructor(private source: Iterable<T>) { }

    public *[Symbol.iterator]() {
        yield* this.source;
    }

    public Where(predicate: (value: T) => boolean): Collection<T>;
    public Where<U extends T>(predicate: (value: T) => value is U): Collection<U>;
    public Where(predicate: (value: T) => boolean): Collection<unknown> {
        return new Collection(this.WhereImpl(predicate));
    }
    private *WhereImpl(predicate: (value: T) => boolean): Generator<T, void, unknown> {
        for (const value of this.source) {
            if (predicate(value)) yield value;
        }
    }

    public Select<U>(predicate: (value: T) => U): Collection<U> {
        return new Collection(this.SelectImpl(predicate));
    }
    public *SelectImpl<U>(predicate: (value: T) => U): Generator<U, void, unknown> {
        for (const value of this.source) {
            yield predicate(value);
        }
    }

    public SelectAsync<U>(predicate: (value: T) => Promise<U>): AsyncCollection<U> {
        return new AsyncCollection(this.SelectAsyncImpl(predicate));
    }
    public async *SelectAsyncImpl<U>(predicate: (value: T) => Promise<U>): AsyncGenerator<U, void, unknown> {
        for (const value of this.source) {
            yield await predicate(value);
        }
    }

    public SelectMany<U>(predicate: (value: T) => U | Iterable<U>): Collection<U> {
        return new Collection(this.SelectManyImpl(predicate));
    }
    public *SelectManyImpl<U>(predicate: (value: T) => U | Iterable<U>): Generator<U, void, undefined> {
        for (const value of this.source) {
            const selectedValue = predicate(value);
            if (Symbol.iterator in selectedValue) {
                yield* selectedValue as Iterable<U>;
            } else {
                yield selectedValue as U;
            }
        }
    }

    public SelectManyAsync<U>(predicate: (value: T) => Promise<U | Iterable<U>>): AsyncCollection<U> {
        return new AsyncCollection(this.SelectManyAsyncImpl(predicate));
    }
    public async *SelectManyAsyncImpl<U>(predicate: (value: T) => Promise<U | Iterable<U>>): AsyncGenerator<U, void, undefined> {
        for (const value of this.source) {
            const selectedValue = await predicate(value);
            if (Symbol.iterator in selectedValue) {
                yield* selectedValue as Iterable<U>;
            } else {
                yield selectedValue as U;
            }
        }
    }

    public GroupBy<U>(predicate: (value: T) => U): Collection<[U, T[]]> {
        return new Collection(this.GroupByImpl(predicate));
    }
    public *GroupByImpl<U>(predicate: (value: T) => U): Generator<[U, T[]], void, undefined> {
        const map = new Map<U, T[]>();
        for (const value of this.source) {
            const key = predicate(value);
            const values = map.get(key);
            if (values) values.push(value);
            else map.set(key, [value]);
        }
        yield* map;
    }

    public OfType<U extends T>(type: new (...params: any[]) => U): Collection<U> {
        return this.Where((value: unknown): value is U => value instanceof type) as Collection<U>;
    }

    public ToMap<U>(predicate: (value: T) => U): Map<U, T> {
        const map = new Map<U, T>();
        for (const value of this.source) {
            const key = predicate(value);
            map.set(key, value);
        }
        return map;
    }

    public ToArray(): T[] {
        return [...this.source];
    }

    public Any(predicate: (value: T) => boolean): boolean {
        for (const value of this.source) {
            if (predicate(value)) return true;
        }
        return false;
    }

    public Distinct(): Collection<T> {
        return new Collection(new Set(this.source));
    }

    public Traverse(predicate: (value: T) => Iterable<T>): Collection<Iterable<T>> {
        return new Collection(this.TraverseImpl(predicate));
    }

    public *TraverseImpl(predicate: (value: T) => Iterable<T>): Generator<Iterable<T>, void, unknown> {
        const stack: Array<Iterable<T>> = [];
        stack.push(this.source);
        while (stack.length > 0) {
            const current = stack.pop()!;
            yield current;
            for (const child of current)
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
    public Where(predicate: (value: T) => boolean): AsyncCollection<unknown> {
        return new AsyncCollection(this.WhereImpl(predicate));
    }
    private async *WhereImpl(predicate: (value: T) => boolean): AsyncGenerator<T, void, unknown> {
        for await (const value of this.source) {
            if (predicate(value)) yield value;
        }
    }

    public Select<U>(predicate: (value: T) => U): AsyncCollection<U> {
        return new AsyncCollection(this.SelectImpl(predicate));
    }
    public async *SelectImpl<U>(predicate: (value: T) => U): AsyncGenerator<U, void, unknown> {
        for await (const value of this.source) {
            yield predicate(value);
        }
    }

    public SelectMany<U>(predicate: (value: T) => U | Iterable<U>): AsyncCollection<U> {
        return new AsyncCollection(this.SelectManyImpl(predicate));
    }
    public async *SelectManyImpl<U>(predicate: (value: T) => U | Iterable<U>): AsyncGenerator<U, void, undefined> {
        for await (const value of this.source) {
            const selectedValue = predicate(value);
            if (Symbol.iterator in selectedValue) {
                yield* selectedValue as Iterable<U>;
            } else {
                yield selectedValue as U;
            }
        }
    }

    public GroupBy<U>(predicate: (value: T) => U): AsyncCollection<[U, T[]]> {
        return new AsyncCollection(this.GroupByImpl(predicate));
    }
    public async *GroupByImpl<U>(predicate: (value: T) => U): AsyncGenerator<[U, T[]], void, undefined> {
        const map = new Map<U, T[]>();
        for await (const value of this.source) {
            const key = predicate(value);
            const values = map.get(key);
            if (values) values.push(value);
            else map.set(key, [value]);
        }
        yield* map;
    }

    public async ToMap<U>(predicate: (value: T) => U): Promise<Map<U, T>> {
        const map = new Map<U, T>();
        for await (const value of this.source) {
            const key = predicate(value);
            map.set(key, value);
        }
        return map;
    }

    public async ToArray(): Promise<T[]> {
        const array: T[] = [];
        for await (const value of this.source) {
            array.push(value);
        }
        return array;
    }

    public async Any(predicate: (value: T) => boolean): Promise<boolean> {
        for await (const value of this.source) {
            if (predicate(value)) return true;
        }
        return false;
    }
}
