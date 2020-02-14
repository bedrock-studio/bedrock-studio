import * as vscode from 'vscode'

import { getLocation, parse } from 'jsonc-parser'

import { CustomCompletion, PathCompletion, PropertyCompletion, StringCompletion } from '../lib/Completions'
import { CompletionItemConstructor, CompletionListConstructor, PointOfInterest } from '../lib/PointOfInterest'
import { Identifier, AnimationStateProvider, DummyProvider, JsonKeyProvider, JsonValueProvider, TextureProvider } from '../lib/Providers'
import { getValueAtPath, matchPaths } from './util'


const providers = {
  ANIMATION: new JsonKeyProvider({
    files: "**/animations/**/*.json",
    path: ["animations"]
  }),
  ANIMATION_CONTROLLER: new JsonKeyProvider({
    files: "**/animation_controllers/**/*.json",
    path: ["animation_controllers"]
  }),
  ANIMATION_STATE: new AnimationStateProvider(),
  CLIENT_ENTITY: new JsonValueProvider({
    files: "**/entity/**/*.json",
    path: ["minecraft:client_entity", "description", "identifier"]
  }),
  MATERIAL: new JsonKeyProvider({
    files: "**/materials/**/*.material",
    path: ["materials"]
  }),
  PARTICLE: new JsonValueProvider({
    files: "**/particles/**/*.json",
    path: ["particle_effect", "description", "identifier"]
  }),
  RENDER_CONTROLLER: new JsonKeyProvider({
    files: "**/render_controllers/**/*.json",
    path: ["render_controllers"]
  }),
  SERVER_ENTITY: new JsonValueProvider({
    files: "**/entities/**/*.json",
    path: ["minecraft:entity", "description", "identifier"]
  }),
  SOUND: new JsonKeyProvider({
    files: "**/sounds/sound_definitions.json",
    path: []
  }),
  TEXTURE: new TextureProvider(),
  GEOMETRY: new DummyProvider(),
  ANIMATION_NICKNAME: new DummyProvider(),
  MOLANG: new DummyProvider()
}

const pointsOfInterest: PointOfInterest<any>[] = [
  // Animation Controller - Initial State
  new PointOfInterest({
    file: "*.json",
    path: ["animation_controllers", "{controller}", "initial_state"],
    isPropertyKey: false,
    completionType: StringCompletion,
    provider: providers.ANIMATION_STATE
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
    completionType: StringCompletion,
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
    provider: providers.ANIMATION
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

export default class BedrockCompletionProvider implements vscode.CompletionItemProvider {
  public async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

    const documentText = document.getText();
    const documentObject = parse(documentText);
    const { path, isAtPropertyKey } = getLocation(documentText, document.offsetAt(position));
    const hasPropertyValue = isAtPropertyKey && typeof getValueAtPath(documentObject, path) !== "undefined";
    const positionRange = document.getWordRangeAtPosition(position);

    for (const item of pointsOfInterest) {
      if (item.isPropertyKey === isAtPropertyKey) {
        const match = matchPaths(path, item.path);
        if (match) {
          const documentData = { document, documentText, documentObject, position, positionPath: path, positionRange, isAtPropertyKey, hasPropertyValue, match }
          const identifiers = await item.provider.getAllIdentifiers(documentData);
          const type = item.completionType;
          if (type.prototype instanceof vscode.CompletionList) {
            return new (type as CompletionListConstructor)(identifiers, documentData);
          }
          else {
            return identifiers.map(identifier => new (type as CompletionItemConstructor)(identifier, documentData));
          }
        }
      }
    }
  }
}
