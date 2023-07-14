import {
  InterfaceDeclaration,
  MethodDeclaration,
  PropertyDeclaration,
} from 'typescript-parser';
import { UmlEntity } from './umlEntity';
import { UmlMethod } from './umlMethod';
import { UmlProperty } from './umlProperty';

export class UmlInterface implements UmlEntity {
  interfaceDeclaration: InterfaceDeclaration;
  constructor(interfaceDeclaration: InterfaceDeclaration) {
    this.interfaceDeclaration = interfaceDeclaration;
  }
  public async toMMD(): Promise<string> {
    let mmd = `class ${this.interfaceDeclaration.name}{\n`;
    mmd += '\t<<Interface>>\n';

    const properties = await Promise.all(this.propertiesToMMD());
    mmd += properties.join('');

    const methods = await Promise.all(this.methodsToMMD());
    mmd += methods.join('');

    mmd += '}\n';

    mmd += this.relations();
    return mmd;
  }

  propertiesToMMD(): Promise<string>[] {
    return this.interfaceDeclaration.properties.map(this.propertyToMMD);
  }

  propertyToMMD(propertyDeclaration: PropertyDeclaration) {
    return new UmlProperty(propertyDeclaration).toMMD();
  }

  private methodsToMMD(): Promise<string>[] {
    return this.interfaceDeclaration.methods.map(this.methodToMMD);
  }

  private methodToMMD(methodDeclaration: MethodDeclaration) {
    return new UmlMethod(methodDeclaration).toMMD();
  }

  private relations() {
    let mmd = '';
    for (const interfaceDeclaration of this.interfaceDeclaration.implements) {
      mmd += `${interfaceDeclaration.name} <|.. ${this.interfaceDeclaration.name}\n`;
    }
    for (const classDeclaration of this.interfaceDeclaration.extends) {
      mmd += `${classDeclaration.name} <|-- ${this.interfaceDeclaration.name}\n`;
    }
    return mmd;
  }
}
