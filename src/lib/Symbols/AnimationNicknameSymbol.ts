import { Symbol, Scope } from '../DocumentGraph';

export class AnimationNicknameSymbol extends Symbol<AnimationNicknameSymbol> {

    public static label = "Animation Nickname";
    public static description = "A nickname for an animation or animation controller.";

    public readonly type = AnimationNicknameSymbol;
    constructor(scope: Scope, identifier: string) {
        super(scope, identifier);
    }
    
}
