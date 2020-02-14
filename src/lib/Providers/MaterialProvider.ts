import { JsonKeyProvider } from "./JsonKeyProvider";
import { DocumentData } from "../DocumentData";
import { Identifier } from "./IdentifierProvider";

export class MaterialProvider extends JsonKeyProvider {
    constructor() {
        super({
            files: "**/materials/**/*.material",
            path: ["materials"]
        });
    }
    async getAllIdentifiers(data: DocumentData) {
        return (await super.getAllIdentifiers(data)).map(cleanIdentifier).filter(i => i.value !== "version");
    }
}

function cleanIdentifier(identifier: Identifier) {
    const index = identifier.value.indexOf(":");
    if(index > 0) identifier.value = identifier.value.substring(0, index);
    return identifier;
}
