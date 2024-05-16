import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenExceptionException extends HttpException {
  message: string;

  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
    this.message = message;
  }
}
