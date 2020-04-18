import { Symbol, Scope } from '../DocumentGraph';

export class ClientEntitySymbol extends Symbol<ClientEntitySymbol> {

    public static label = "Client Entity";
    public static description = "A state defines a group of animations to process.";
    public static helpUrl = "https://bedrock.dev/c/Entities#Client%20Entity%20Documentation";

    public readonly type = ClientEntitySymbol;
    constructor(scope: Scope, identifier: string) {
        super(scope, identifier);
    }
    
}
