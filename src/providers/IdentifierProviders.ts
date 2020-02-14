import { AnimationStateProvider, DummyProvider, JsonKeyProvider, JsonValueProvider, TextureProvider, MaterialProvider, MergeProvider } from '../lib/Providers'

export const ANIMATION = new JsonKeyProvider({
    files: "**/animations/**/*.json",
    path: ["animations"]
})

export const ANIMATION_CONTROLLER = new JsonKeyProvider({
    files: "**/animation_controllers/**/*.json",
    path: ["animation_controllers"]
})

export const ANIMATION_OR_CONTROLLER = new MergeProvider(
    ANIMATION,
    ANIMATION_CONTROLLER
)

export const ANIMATION_STATE = new AnimationStateProvider()

export const CLIENT_ENTITY = new JsonValueProvider({
    files: "**/entity/**/*.json",
    path: ["minecraft:client_entity", "description", "identifier"]
})

export const MATERIAL = new MaterialProvider()

export const PARTICLE = new JsonValueProvider({
    files: "**/particles/**/*.json",
    path: ["particle_effect", "description", "identifier"]
})

export const RENDER_CONTROLLER = new JsonKeyProvider({
    files: "**/render_controllers/**/*.json",
    path: ["render_controllers"]
})

export const SERVER_ENTITY = new JsonValueProvider({
    files: "**/entities/**/*.json",
    path: ["minecraft:entity", "description", "identifier"]
})

export const SOUND = new JsonKeyProvider({
    files: "**/sounds/sound_definitions.json",
    path: []
})

export const TEXTURE = new TextureProvider()

export const GEOMETRY = new DummyProvider()

export const ANIMATION_NICKNAME = new DummyProvider()

export const MOLANG = new DummyProvider()

export const BONE = new DummyProvider()