import { default as handler } from './src/main.js';

await handler({
  req: { body: '{}' },
  res: { json: (v) => console.log(JSON.stringify(v)) },
  log: console.log,
  error: console.error,
});
