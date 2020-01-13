import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

const passportModule = PassportModule.register({ defaultStrategy: 'jwt' });

// set this module global to export 'passportModule' globally
@Global()
@Module({
  imports: [
    UserModule,
    passportModule,
    JwtModule.registerAsync({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      useFactory: async (configService: ConfigService): Promise<Record<string, any>> => ({
        privateKey: configService.get<string>('jwt.privateKey'),
        signOptions: {
          // Refer to 'https://github.com/auth0/node-jsonwebtoken#usage' for more options
          expiresIn: '1h',
          // If we decide to use asymmetric algorithms, be sure you pass the 'algorithm' option.
          algorithm: 'RS256'
        }
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, passportModule]
})
export class AuthModule {}
