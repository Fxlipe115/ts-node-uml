import { Queue } from 'queue-typescript';
import { UmlClass } from './umlClass';
import { UmlEntity } from './umlEntity';
import {
  ClassDeclaration,
  Declaration,
  File,
  InterfaceDeclaration,
  TypescriptParser,
} from 'typescript-parser';
import { UmlInterface } from './umlInterface';
import { dirname } from 'path';

export class UmlClassDiagram implements UmlEntity {
  private projectFiles: Queue<File>;
  private parser: TypescriptParser;
  private processedFiles: Array<string>;

  constructor() {
    this.projectFiles = new Queue<File>();
    this.parser = new TypescriptParser();
    this.processedFiles = new Array<string>();
  }

  public async includeProjectFile(filePath: string, rootPath: string) {
    const filePathWithExt = filePath.endsWith('.ts')
      ? filePath
      : filePath + '.ts';
    const file = await this.parser.parseFile(filePathWithExt, rootPath);
    if (file) {
      this.projectFiles.enqueue(file);
    }
  }

  public async toMMD(): Promise<string> {
    let mmd = `classDiagram\n`;
    while (this.projectFiles.length > 0) {
      const file = this.projectFiles.dequeue()!;
      if (!this.processedFiles.includes(file.filePath)) {
        mmd += await this.processFile(file);
        this.processedFiles.push(file.filePath);
      }
    }
    return mmd;
  }

  private async processFile(file: File) {
    file.imports.forEach((importFile) => {
      if (importFile.libraryName.startsWith('.')) {
        this.includeProjectFile(importFile.libraryName, dirname(file.filePath));
      }
    });

    let mmd = '';
    for (const declaration of file.declarations) {
      // console.log(declaration);
      switch (declaration.constructor) {
        case ClassDeclaration:
          mmd += await this.toClassDeclaration(declaration);
          break;
        case InterfaceDeclaration:
          mmd += await this.toInterfaceDeclaration(declaration);
          break;
        default:
          break;
      }
    }
    return mmd;
  }
  private async toInterfaceDeclaration(declaration: Declaration) {
    const umlClass: UmlEntity = new UmlInterface(
      declaration as InterfaceDeclaration,
    );
    return await umlClass.toMMD();
  }

  private async toClassDeclaration(declaration: Declaration) {
    const umlClass: UmlEntity = new UmlClass(declaration as ClassDeclaration);
    return await umlClass.toMMD();
  }
}
