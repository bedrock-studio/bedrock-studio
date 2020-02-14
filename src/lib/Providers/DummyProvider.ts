import { Provider } from "./IdentifierProvider";

export class DummyProvider implements Provider<any> {
    getAllIdentifiers() {
      return [];
    }
    getMatchingIdentifiers() {
      return [];
    }
  }
  