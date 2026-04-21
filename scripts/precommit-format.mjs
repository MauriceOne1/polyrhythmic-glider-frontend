import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const PRETTIER_EXTENSIONS = new Set([
  '.css',
  '.html',
  '.js',
  '.json',
  '.md',
  '.scss',
  '.ts',
  '.yaml',
  '.yml',
]);
const prettierCliPath = fileURLToPath(
  new URL('../node_modules/prettier/bin/prettier.cjs', import.meta.url),
);

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    stdio: 'pipe',
    ...options,
  });

  if (result.status !== 0) {
    const message = [result.stdout, result.stderr].filter(Boolean).join('\n').trim();
    throw new Error(message || `Command failed: ${command} ${args.join(' ')}`);
  }

  return result.stdout;
}

function hasSupportedExtension(path) {
  const normalizedPath = path.toLowerCase();
  return [...PRETTIER_EXTENSIONS].some((extension) => normalizedPath.endsWith(extension));
}

const stagedOutput = run('git', ['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z'], {
  encoding: 'buffer',
});

const stagedFiles = stagedOutput
  .toString('utf8')
  .split('\0')
  .filter(Boolean)
  .filter(hasSupportedExtension);

if (stagedFiles.length === 0) {
  process.exit(0);
}

run(process.execPath, [prettierCliPath, '--write', '--ignore-unknown', '--', ...stagedFiles], {
  stdio: 'inherit',
});

run('git', ['add', '--', ...stagedFiles], {
  stdio: 'inherit',
});
