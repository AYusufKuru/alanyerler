import { mkdirSync } from 'fs';
import { resolve } from 'path';

export function uploadDir() {
  const configured = process.env.UPLOAD_DIR ?? 'uploads';
  const dir = resolve(process.cwd(), configured);
  mkdirSync(dir, { recursive: true });
  return dir;
}
