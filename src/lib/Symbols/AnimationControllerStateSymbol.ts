import { Symbol, Scope } from '../DocumentGraph';

export class AnimationControllerStateSymbol extends Symbol<AnimationControllerStateSymbol> {

    public static label = "Animation Controller State";
    public static description = "A state defines a group of animations to process.";
    public static helpUrl = "https://bedrock.dev/c/Animations#States";
    
    public readonly type = AnimationControllerStateSymbol;
    constructor(scope: Scope, identifier: string) {
        super(scope, identifier);
    }
    
}
