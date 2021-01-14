import Zip from 'jszip';
import { parseString } from 'xml2js';
import { v4 as uuid } from 'uuid';
import { ParseSiqResult } from 'shared/src';

import { promisify } from 'util';
import path from 'path';

const parseXml = promisify(parseString);

export async function parseSiq(
  content: Buffer
): Promise<{
  originalContent: any;
  game: ParseSiqResult;
  files: any;
  media: Record<string, string>;
}> {
  const zip = new Zip();
  await zip.loadAsync(content, { createFolders: true });

  const contentXml = await zip.files['content.xml'].async('nodebuffer');
  const data = await parseXml(contentXml.toString('utf-8'));

  const themes = {};
  const questions = {};
  const media = {};
  let fileCounter = 0;

  function normalizeFile(q: any) {
    const type = q.$.type;
    const filename = decodeURIComponent(q._.substring(1));
    const ext = path.extname(q._);

    const originalFileId =
      type === 'image'
        ? `Images/${filename}`
        : type === 'voice'
        ? `Audio/${filename}`
        : q._;
    const fileId = `${fileCounter++}${ext}`;
    media[fileId] = originalFileId;
    return { fileId, type };
  }

  const rounds = data.package.rounds[0].round.map((round, index) => {
    return {
      id: index,
      name: round.$.name,
      themes: round.themes[0].theme.map((theme) => {
        const result = {
          id: uuid(),
          name: theme.$.name,
          comments: theme.info && theme.info[0].comments,
          questions: theme.questions[0].question.map((question) => {
            const result = {
              id: uuid(),
              price: question.$.price,
              question: null,
              answer: question.right[0].answer[0],
              answerType: 'text',
            };

            const atoms = question.scenario[0].atom;
            const q = atoms[0];
            if (typeof q === 'string') {
              result.question = {
                text: q,
                type: 'text',
              };
            } else {
              const { fileId, type } = normalizeFile(q);

              result.question = {
                fileId,
                type,
              };

              if (atoms.length === 3 && atoms[1].$.type === 'marker') {
                const { fileId, type } = normalizeFile(atoms[2]);
                result.answer = fileId;
                result.answerType = type;
              }
            }

            questions[result.id] = result;
            return result.id;
          }),
        };

        themes[result.id] = result;
        return result.id;
      }),
    };
  });

  const game = {
    id: data.package.$.id,
    name: data.package.$.name,
    version: data.package.$.version,
    rounds,
    themes,
    questions,
  };

  return {
    originalContent: data,
    game,
    files: Object.entries(zip.files).reduce((acc, [key, value]) => {
      acc[decodeURIComponent(key)] = value;
      return acc;
    }, {}),
    media,
  };
}
