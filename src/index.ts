import { ArgumentParser } from 'argparse';
import { LIB_VERSION } from './version';
import { UmlClassDiagram } from './umlClassDiagram';

const argParser = new ArgumentParser({
  description: 'Generate class diagram for ts node project',
});

argParser.add_argument('file', { help: 'root file of ts node project' });
argParser.add_argument('-v', '--version', {
  action: 'version',
  version: LIB_VERSION,
});
const args = argParser.parse_args();

async function f() {
  const umlClassDiagram: UmlClassDiagram = new UmlClassDiagram();
  await umlClassDiagram.includeProjectFile(args.file, 'workspace root');

  console.log(await umlClassDiagram.toMMD());
}
f();
