import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  get() {
    // const result = this.prisma.user.findMany({
    //   where: {
    //     status: 'pending',
    //   },
    //   orderBy: [
    //     {
    //       created_at: 'desc',
    //     },
    //     {
    //       id: 'desc',
    //     },
    //   ],
    // });
    //
    // console.log(result);
    //
    // return result;
  }
}
