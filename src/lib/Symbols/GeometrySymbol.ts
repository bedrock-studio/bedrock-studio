import { Symbol, Scope } from '../DocumentGraph';

export class GeometrySymbol extends Symbol<GeometrySymbol> {

    public static label = "Entity Geometry";
    public static description = "Geometry for an entity.";

    public readonly type = GeometrySymbol;
    constructor(scope: Scope, identifier: string) {
        super(scope, identifier);
    }
    
}
