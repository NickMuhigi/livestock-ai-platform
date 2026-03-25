import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const files = [
  'figure3-classdiagram.svg',
  'figure4-erdiagram.svg',
  'figure5-sequence.svg',
  'figure6-mlarchitecture.svg',
];

for (const file of files) {
  const svgPath = join(__dirname, 'public', file);
  const pngPath = svgPath.replace('.svg', '.png');

  const svg = readFileSync(svgPath);
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1800 },
    background: 'white',
  });

  const rendered = resvg.render();
  const png = rendered.asPng();
  writeFileSync(pngPath, png);
  console.log(`✓  ${file}  →  ${file.replace('.svg', '.png')}`);
}
