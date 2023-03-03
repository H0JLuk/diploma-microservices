export abstract class IAuthService {
  abstract getText(): Promise<string>;
}
