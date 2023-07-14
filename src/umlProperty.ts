import { PropertyDeclaration } from 'typescript-parser';
import { UmlEntity } from './umlEntity';
import { memberVisibility } from './memberVisibility';

export class UmlProperty implements UmlEntity {
  propertyDeclaration: PropertyDeclaration;
  constructor(propertyDeclaration: PropertyDeclaration) {
    this.propertyDeclaration = propertyDeclaration;
  }
  public async toMMD(): Promise<string> {
    const visibility = memberVisibility.get(
      this.propertyDeclaration.visibility,
    );
    let type = this.propertyDeclaration.type ?? 'any';
    type = type.startsWith('{') ? 'object' : type;
    const name = this.propertyDeclaration.name;
    const staticModifier = this.propertyDeclaration.isStatic ? '$' : '';
    return `\t${visibility}${type} ${name}${staticModifier}\n`;
  }
}
