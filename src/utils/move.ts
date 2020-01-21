import {
  createReadStream,
  createWriteStream,
  promises as fsPromise
} from 'fs';
import * as rimraf from 'rimraf';

function fallbackCopy(oldPath: string, newPath: string): Promise<void> {
  return new Promise((resolve, reject): void => {
    const readStream = createReadStream(oldPath);
    const writeStream = createWriteStream(newPath);

    function errorCallback(error): void {
      error && reject(error);
    }

    readStream.on('error', errorCallback);
    writeStream.on('error', errorCallback);

    readStream.on('close', async function () {
      try {
        await fsPromise.unlink(oldPath);
      } catch (error) {
        reject(error);
      }
      resolve();
    });

    readStream.pipe(writeStream);
  });
}

export async function move(oldPath: string, newPath: string): Promise<void> {
  try {
    await fsPromise.rename(oldPath, newPath);
  } catch (error) {
    if (error.code === 'EXDEV') {
      await fallbackCopy(oldPath, newPath);
    } else {
      throw error;
    }
  }
}

export function deleteFileOrDirectory(path): Promise<void> {
  return new Promise((resolve, reject): void => {
    rimraf(path, (error): void => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
