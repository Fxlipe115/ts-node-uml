import { IGreeter } from './interfaces/greeter';

abstract class AbstractGreeter implements IGreeter {
  greet(param: string, param2: number): string {
    throw new Error('Method not implemented.');
  }

  abstract abstractGreet(): void;

  private coisa: number;
}

export class Greeter extends AbstractGreeter {
  abstractGreet(): void {
    throw new Error('Method not implemented.');
  }
  greeting: string;
  public pblc = 1;
  private prvt = 1;
  protected ptctd = 1;
  d = 1;
  e = 1;

  constructor(message: string) {
    super();
    this.greeting = message;
  }

  greet(param: string, param2: number): string {
    return 'Hello, ' + this.greeting;
  }
}
