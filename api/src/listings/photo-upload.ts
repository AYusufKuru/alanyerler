import { randomUUID } from 'crypto';
import { readFile, rename } from 'fs/promises';
import { basename, dirname, extname, join } from 'path';
import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { uploadDir } from '../uploads/upload-path';

export const photoMimeExtensions = new Map<string, string>([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
]);

export function sniffImage(bytes: Buffer): { mime: string; ext: string } | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { mime: 'image/jpeg', ext: '.jpg' };
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return { mime: 'image/png', ext: '.png' };
  }
  if (
    bytes.length >= 12 &&
    bytes.toString('ascii', 0, 4) === 'RIFF' &&
    bytes.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return { mime: 'image/webp', ext: '.webp' };
  }
  return null;
}

export async function normalizeUploadedPhoto(file: {
  filename: string;
  mimetype: string;
  path: string;
}): Promise<void> {
  if (photoMimeExtensions.has(file.mimetype)) return;
  const kind = sniffImage(await readFile(file.path));
  if (!kind) {
    throw new BadRequestException('Fotoğraflar JPG, PNG veya WEBP olmalı.');
  }
  const filename = `${basename(file.filename, extname(file.filename))}${kind.ext}`;
  const nextPath = join(dirname(file.path), filename);
  if (nextPath !== file.path) {
    await rename(file.path, nextPath);
  }
  file.filename = filename;
  file.path = nextPath;
  file.mimetype = kind.mime;
}

export const photoUploadOptions = {
  storage: diskStorage({
    destination: (
      _request: unknown,
      _file: unknown,
      callback: (error: Error | null, destination: string) => void,
    ) => {
      callback(null, uploadDir());
    },
    filename: (
      _request: unknown,
      file: { mimetype: string },
      callback: (error: Error | null, filename: string) => void,
    ) => {
      const extension = photoMimeExtensions.get(file.mimetype) ?? '.bin';
      callback(null, `${randomUUID()}${extension}`);
    },
  }),
  limits: { fileSize: 8 * 1024 * 1024, files: 5 },
};
