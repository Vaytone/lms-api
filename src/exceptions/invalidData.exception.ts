import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidDataException extends HttpException {
  message: string;

  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
    this.message = message;
  }
}
