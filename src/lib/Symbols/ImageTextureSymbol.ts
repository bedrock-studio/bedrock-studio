import { Symbol, Scope } from '../DocumentGraph';

export class ImageTextureSymbol extends Symbol<ImageTextureSymbol> {
    
    public static label = "Image Texture";
    public static description = "An image Texture.";

    public readonly type = ImageTextureSymbol;
    constructor(scope: Scope, identifier: string) {
        super(scope, identifier);
    }
    
}
