import { MethodDeclaration, ParameterDeclaration } from 'typescript-parser';
import { UmlEntity } from './umlEntity';
import { memberVisibility } from './memberVisibility';
import { UmlParameter } from './umlParameter';

export class UmlMethod implements UmlEntity {
  methodDeclaration: MethodDeclaration;
  constructor(methodDeclaration: MethodDeclaration) {
    this.methodDeclaration = methodDeclaration;
  }
  public async toMMD(): Promise<string> {
    const visibility = memberVisibility.get(this.methodDeclaration.visibility);
    const name = this.methodDeclaration.name;

    let mmd = `\t${visibility}${name}(`;

    const parameters = await Promise.all(this.parametersToMMD());
    mmd += parameters.join(', ');

    const returnType = this.methodDeclaration.type
      ? ` ${this.methodDeclaration.type}`
      : '';
    const abstractModifier = this.methodDeclaration.isAbstract ? '*' : '';
    const staticModifier = this.methodDeclaration.isStatic ? '$' : '';
    mmd += `)${returnType}${abstractModifier}${staticModifier}\n`;
    return mmd;
  }

  private parametersToMMD(): Promise<string>[] {
    return this.methodDeclaration.parameters.map(this.parameterToMMD);
  }

  private parameterToMMD(parameter: ParameterDeclaration): Promise<string> {
    return new UmlParameter(parameter).toMMD();
  }
}
