import { JwtModule } from '@nestjs/jwt';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
  ],
  exports: [JwtModule],
})
export class CoreModule {}
