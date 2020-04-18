import { Symbol, Scope } from '../DocumentGraph';

export class AnimationSymbol extends Symbol<AnimationSymbol> {

    public static label = "Animation";
    public static description = "An animation";

    public readonly type = AnimationSymbol;
    constructor(scope: Scope, identifier: string) {
        super(scope, identifier);
    }
    
}
