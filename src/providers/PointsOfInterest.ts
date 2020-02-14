
import { CustomCompletion, PathCompletion, PropertyCompletion, StringCompletion } from '../lib/Completions'
import { PointOfInterest } from '../lib/PointOfInterest'
import { Identifier } from '../lib/Providers'
import * as providers from './IdentifierProviders';

export const pointsOfInterest: PointOfInterest<any>[] = [
    // Animation Controller - Initial State
    new PointOfInterest({
        file: "*.json",
        path: ["animation_controllers", "{controller}", "initial_state"],
        isPropertyKey: false,
        completionType: StringCompletion,
        provider: providers.ANIMATION_STATE
    }),
    // Animation Controller - Animations - Animation Nickname
    new PointOfInterest({
        file: "*.json",
        path: ["animation_controllers", "{controller}", "animations", "{index}"],
        isPropertyKey: false,
        completionType: StringCompletion,
        provider: providers.ANIMATION_NICKNAME
    }),
    // Animation Controller - Animations - Animation Nickname Alt
    new PointOfInterest({
        file: "*.json",
        path: ["animation_controllers", "{controller}", "animations", "{index}", "{nickname}"],
        isPropertyKey: true,
        completionType: PropertyCompletion,
        provider: providers.ANIMATION_NICKNAME
    }),
    // Animation Controller - Animations - Animation Nickname Alt - Molang
    new PointOfInterest({
        file: "*.json",
        path: ["animation_controllers", "{controller}", "animations", "{index}", "{nickname}"],
        isPropertyKey: false,
        completionType: CustomCompletion,
        provider: providers.MOLANG
    }),
    // Animation Controller - Transitions - To State
    new PointOfInterest({
        file: "*.json",
        path: ["animation_controllers", "{controller}", "states", "{state}", "transitions", "{index}", "{toState}"],
        isPropertyKey: true,
        completionType: PropertyCompletion,
        provider: providers.ANIMATION_STATE
    }),
    // Animation Controller - Transitions - To State - Molang
    new PointOfInterest({
        file: "*.json",
        path: ["animation_controllers", "{controller}", "states", "{state}", "transitions", "{index}", "{toState}"],
        isPropertyKey: false,
        completionType: CustomCompletion,
        provider: providers.MOLANG
    }),
    // Animation - Bone
    new PointOfInterest({
        file: "*.json",
        path: ["animations", "{animation}", "bones", "{bone}"],
        isPropertyKey: true,
        completionType: PropertyCompletion,
        provider: providers.BONE
    }),
    // Animation - Bone - Transform - Molang
    new PointOfInterest({
        file: "*.json",
        path: ["animations", "{animation}", "bones", "{bone}", "{transform}", "{axis}"],
        isPropertyKey: false,
        completionType: CustomCompletion,
        provider: providers.MOLANG
    }),
    // Client Entity - Identifier
    new PointOfInterest({
        file: "*.json",
        path: ["minecraft:client_entity", "description", "identifier"],
        isPropertyKey: false,
        completionType: StringCompletion,
        provider: providers.SERVER_ENTITY
    }),
    // Client Entity - Materials
    new PointOfInterest({
        file: "*.json",
        path: ["minecraft:client_entity", "description", "materials", "{nickname}"],
        isPropertyKey: false,
        completionType: StringCompletion,
        provider: providers.MATERIAL
    }),
    // Client Entity - Textures
    new PointOfInterest<Identifier>({
        file: "*.json",
        path: ["minecraft:client_entity", "description", "textures", "{nickname}"],
        isPropertyKey: false,
        completionType: PathCompletion,
        provider: providers.TEXTURE
    }),
    // Client Entity - Geometry
    new PointOfInterest({
        file: "*.json",
        path: ["minecraft:client_entity", "description", "geometry", "{nickname}"],
        isPropertyKey: false,
        completionType: StringCompletion,
        provider: providers.GEOMETRY
    }),
    // Client Entity - Scripts - Pre-Animation - Molang
    new PointOfInterest({
        file: "*.json",
        path: ["minecraft:client_entity", "description", "scripts", "pre_animation", "{index}"],
        isPropertyKey: false,
        completionType: CustomCompletion,
        provider: providers.MOLANG
    }),
    // Client Entity - Scripts - Initialize - Molang
    new PointOfInterest({
        file: "*.json",
        path: ["minecraft:client_entity", "description", "scripts", "initialize", "{index}"],
        isPropertyKey: false,
        completionType: CustomCompletion,
        provider: providers.MOLANG
    }),
    // Client Entity - Scripts - Animate
    new PointOfInterest({
        file: "*.json",
        path: ["minecraft:client_entity", "description", "scripts", "animate", "{index}"],
        isPropertyKey: false,
        completionType: StringCompletion,
        provider: providers.ANIMATION_NICKNAME
    }),
    // Client Entity - Animations
    new PointOfInterest({
        file: "*.json",
        path: ["minecraft:client_entity", "description", "animations", "{nickname}"],
        isPropertyKey: false,
        completionType: StringCompletion,
        provider: providers.ANIMATION_OR_CONTROLLER
    }),
    // Client Entity - Particle Effects
    new PointOfInterest({
        file: "*.json",
        path: ["minecraft:client_entity", "description", "particle_effects", "{nickname}"],
        isPropertyKey: false,
        completionType: StringCompletion,
        provider: providers.PARTICLE
    }),
    // Client Entity - Animation Controllers
    new PointOfInterest({
        file: "*.json",
        path: ["minecraft:client_entity", "description", "animation_controllers", "{index}", "{nickname}"],
        isPropertyKey: false,
        completionType: StringCompletion,
        provider: providers.ANIMATION_CONTROLLER
    }),
    // Client Entity - Render Controllers
    new PointOfInterest({
        file: "*.json",
        path: ["minecraft:client_entity", "description", "render_controllers", "{index}"],
        isPropertyKey: false,
        completionType: StringCompletion,
        provider: providers.RENDER_CONTROLLER
    }),
    // Client Entity - Render Controllers - Molang
    new PointOfInterest({
        file: "*.json",
        path: ["minecraft:client_entity", "description", "render_controllers", "{index}", "{controller}"],
        isPropertyKey: true,
        completionType: PropertyCompletion,
        provider: providers.RENDER_CONTROLLER
    })
];