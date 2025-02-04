import { Injectable } from '@nestjs/common';
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { MemoryStoredFile } from 'nestjs-form-data';
import { AWSDirname } from '../../types/core.types';
import { Readable } from 'stream';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class FileManagerService {
  private AWS_S3_BUCKET = 'school-woop-app';
  private s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: 'eu-central-1',
  });

  async uploadFile(dirName: AWSDirname, file: MemoryStoredFile) {
    const { originalName } = file;

    await this.s3_upload(file.buffer, this.AWS_S3_BUCKET, `${dirName}/${originalName}.${file.mimetype.split('/')[1]}`);

    return `${dirName}/${originalName}.${file.mimetype.split('/')[1]}`;
  }

  async uploadMinorFile(dirName: AWSDirname, file: MemoryStoredFile) {
    const { originalName } = file;

    await this.s3_upload(file.buffer, this.AWS_S3_BUCKET, `${dirName}/${originalName}`);

    return `${dirName}/${originalName}`;
  }

  async uploadFiles(dirName: AWSDirname, files: MemoryStoredFile[]) {
    const uploadedFiles = [];

    try {
      for (const file of files) {
        const { originalName } = file;
        const filePath = `${dirName}/${originalName}.${file.mimetype.split('/')[1]}`;

        // Upload file to S3
        await this.s3_upload(file.buffer, this.AWS_S3_BUCKET, filePath);

        // Store the successfully uploaded file path
        uploadedFiles.push(filePath);
      }

      // Return paths of successfully uploaded files
      return uploadedFiles;
    } catch (error) {
      // If any file upload fails, delete all previously uploaded files
      for (const uploadedFile of uploadedFiles) {
        await this.s3_delete(uploadedFile, this.AWS_S3_BUCKET);
      }

      throw new Error('File upload failed. All previously uploaded files have been deleted.');
    }
  }

  async s3_delete(filePath: string, bucket: string) {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: filePath,
    });

    try {
      await this.s3.send(command);
    } catch (error) {
      console.error('Error deleting file from S3:', error);
    }
  }

  async getPhoto(key: string) {
    const command = new GetObjectCommand({
      Key: key,
      Bucket: this.AWS_S3_BUCKET,
    });
    const response = await this.s3.send(command);
    const stream = response.Body as Readable;

    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.once('end', () => resolve(Buffer.concat(chunks)));
      stream.once('error', () => {
        reject(1);
      });
    });
  }

  private async s3_upload(file, bucket, name) {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: String(name),
      Body: file,
    });

    try {
      const response = await this.s3.send(command);
      return response;
    } catch (e) {
      console.log(e);
    }
  }
}
