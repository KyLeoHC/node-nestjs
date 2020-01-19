import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

const passportModule = PassportModule.register({ defaultStrategy: 'jwt' });

// Set this module global to export 'passportModule' globally
@Global()
@Module({
  imports: [
    passportModule,
    JwtModule.registerAsync({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      useFactory: async (configService: ConfigService): Promise<Record<string, any>> => ({
        privateKey: configService.get<string>('jwt.privateKey'),
        signOptions: configService.get<object>('jwt.signOptions')
      }),
      inject: [ConfigService]
    }),
    UserModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, passportModule]
})
export class AuthModule { }
