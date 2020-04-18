import { Symbol, Scope } from '../DocumentGraph';

export class AnimationControllerSymbol extends Symbol<AnimationControllerSymbol> {

    public static label = "Animation Controller";
    public static description = "Animation controllers decide which animations to play when.";
    public static helpUrl = "https://bedrock.dev/c/Animations#Animation%20Controllers";
    public readonly type = AnimationControllerSymbol;

    constructor(scope: Scope, identifier: string) {
        super(scope, identifier);
    }

}
