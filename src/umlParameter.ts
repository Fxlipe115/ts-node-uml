import { ParameterDeclaration } from 'typescript-parser';
import { UmlEntity } from './umlEntity';

export class UmlParameter implements UmlEntity {
  parameterDeclaration: ParameterDeclaration;
  constructor(parameterDeclaration: ParameterDeclaration) {
    this.parameterDeclaration = parameterDeclaration;
  }
  public async toMMD(): Promise<string> {
    const type = this.parameterDeclaration.type
      ? `${this.parameterDeclaration.type} `
      : '';
    const name = this.parameterDeclaration.name;

    return `${type}${name}`;
  }
}
