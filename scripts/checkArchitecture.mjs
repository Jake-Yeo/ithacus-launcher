import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const sourceDirectories = [new URL('../src/', import.meta.url), new URL('../server/', import.meta.url)]

async function collectSourceFiles(directory) {
  const directoryEntries = await readdir(directory, { withFileTypes: true })
  const nestedFiles = await Promise.all(directoryEntries.map(directoryEntry => {
    const entryPath = path.join(directory.pathname, directoryEntry.name)
    return directoryEntry.isDirectory() ? collectSourceFiles(new URL(`file://${entryPath}/`)) : [entryPath]
  }))
  return nestedFiles.flat().filter(filePath => /\.(ts|tsx)$/.test(filePath))
}

const sourceFiles = (await Promise.all(sourceDirectories.map(collectSourceFiles))).flat()
const architectureViolations = []
for (const sourceFile of sourceFiles) {
  const sourceCode = await readFile(sourceFile, 'utf8')
  const relativePath = path.relative(process.cwd(), sourceFile)
  if (sourceCode.split('\n').length > 100) architectureViolations.push(`${relativePath} exceeds 100 lines`)
  if (/\b(?:bg|text|border|from|to|shadow)-\[#[0-9a-f]{3,8}\]/i.test(sourceCode)) architectureViolations.push(`${relativePath} contains a raw Tailwind color`)
  if (/\[(?:-?\d*\.?\d+)(?:px|rem)\]/i.test(sourceCode)) architectureViolations.push(`${relativePath} contains raw Tailwind spacing`)
}

if (architectureViolations.length) {
  console.error(architectureViolations.join('\n'))
  process.exit(1)
}
