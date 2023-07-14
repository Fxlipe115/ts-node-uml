import {
  ClassDeclaration,
  MethodDeclaration,
  PropertyDeclaration,
} from 'typescript-parser';
import { UmlEntity } from './umlEntity';
import { UmlMethod } from './umlMethod';
import { UmlProperty } from './umlProperty';

export class UmlClass implements UmlEntity {
  classDeclaration: ClassDeclaration;
  constructor(classDeclaration: ClassDeclaration) {
    this.classDeclaration = classDeclaration;
  }
  public async toMMD(): Promise<string> {
    let mmd = `class ${this.classDeclaration.name}{\n`;
    mmd += this.classDeclaration.methods.find((method) => method.isAbstract)
      ? '\t<<Abstract>>\n'
      : '';

    const properties = await Promise.all(this.propertiesToMMD());
    mmd += properties.join('');

    const methods = await Promise.all(this.methodsToMMD());
    mmd += methods.join('');

    mmd += '}\n';
    mmd += this.relations();
    return mmd;
  }

  propertiesToMMD(): Promise<string>[] {
    return this.classDeclaration.properties.map(this.propertyToMMD);
  }

  propertyToMMD(propertyDeclaration: PropertyDeclaration) {
    return new UmlProperty(propertyDeclaration).toMMD();
  }

  private methodsToMMD(): Promise<string>[] {
    return this.classDeclaration.methods.map(this.methodToMMD);
  }

  private methodToMMD(methodDeclaration: MethodDeclaration) {
    return new UmlMethod(methodDeclaration).toMMD();
  }
  private relations() {
    let mmd = '';
    for (const interfaceDeclaration of this.classDeclaration.implements) {
      mmd += `${interfaceDeclaration.name} <|.. ${this.classDeclaration.name}\n`;
    }
    for (const classDeclaration of this.classDeclaration.extends) {
      mmd += `${classDeclaration.name} <|-- ${this.classDeclaration.name}\n`;
    }
    return mmd;
  }
}
