import Zip from 'jszip';
import { parseString } from 'xml2js';

import { promisify } from 'util';

const parseXml = promisify(parseString);

export async function parseSiq(content: Buffer) {
  const zip = new Zip();
  await zip.loadAsync(content, { createFolders: true });

  const contentXml = await zip.files['content.xml'].async('nodebuffer');
  const data = await parseXml(contentXml.toString('utf-8'));

  const result = {
    id: data.package.$.id,
    name: data.package.$.name,
    rounds: data.package.rounds[0].round.map((round) => ({
      name: round.$.name,
      themes: round.themes[0].theme.map((theme) => ({
        name: theme.$.name,
        comments: theme.info && theme.info[0].comments,
        questions: theme.questions[0].question.map((question) => ({
          price: question.$.price,
          question: question.scenario[0].atom[0],
          answer: question.right[0].answer[0],
        })),
      })),
    })),
  };

  return result;
}
