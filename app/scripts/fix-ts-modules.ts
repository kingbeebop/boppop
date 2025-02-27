import fs from 'fs';
import path from 'path';

const rootDir = './';
const excludeDirs = ['node_modules', '.next', 'public'];

function findTsFiles(dir: string): string[] {
  const files: string[] = [];
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory() && !excludeDirs.includes(entry.name)) {
      files.push(...findTsFiles(fullPath));
    } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function fixTsModule(filePath: string): void {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // If file has no imports/exports and is not empty
  if (!content.includes('import') && !content.includes('export') && content.trim().length > 0) {
    console.log(`Adding export {} to ${filePath}`);
    fs.writeFileSync(filePath, content.trim() + '\n\nexport {};\n');
  }
}

const tsFiles = findTsFiles(rootDir);
tsFiles.forEach(fixTsModule); 