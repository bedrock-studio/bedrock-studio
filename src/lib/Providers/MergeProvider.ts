import { Provider } from "./IdentifierProvider";
import { DocumentData } from "../DocumentData";

export class MergeProvider<T> implements Provider<T> {
    constructor(private provider1: Provider<T>, private provider2: Provider<T>) { }
    async getAllIdentifiers(data: DocumentData) {
        return (await this.provider1.getAllIdentifiers(data)).concat(await this.provider2.getAllIdentifiers(data));
    }
    async getMatchingIdentifiers(value: string, data: DocumentData) {
        return (await this.provider1.getMatchingIdentifiers(value, data)).concat(await this.provider2.getMatchingIdentifiers(value, data));
    }
}
