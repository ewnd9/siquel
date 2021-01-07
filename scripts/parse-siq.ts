import fs from 'fs';
import { parseSiq } from '../src/parse-siq';

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main() {
  const zipContent = fs.readFileSync(process.argv[2]);
  const result = await parseSiq(zipContent);

  console.log(
    require('util').inspect(result, { showHidden: false, depth: null })
  );
  // fs.writeFileSync(`test.json`, JSON.stringify(result, null, 2));
}
