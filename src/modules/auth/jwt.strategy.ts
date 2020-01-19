import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload, AuthUser } from './interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.publicKey'),
      // If we decide to use asymmetric algorithms, be sure you pass the 'algorithm' option.
      algorithms: ['RS256']
    });
  }

  /**
   * For the jwt-strategy, Passport first verifies the JWT's signature and decodes the JSON.
   * It then invokes our validate() method passing the decoded JSON as its single parameter.
   * @param {JwtPayload} payload - JWT payload
   */
  public async validate(payload: JwtPayload): Promise<AuthUser> {
    // We can inject other business logic into here.
    // For example, we could do a database lookup in our validate() method to extract more information about the user,
    // resulting in a more enriched user object being available in our Request.
    return { id: payload.sub, username: payload.username };
  }
}
