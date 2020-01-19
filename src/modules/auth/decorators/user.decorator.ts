import { createParamDecorator } from '@nestjs/common';
import { AuthUser } from '../interfaces';

export const User = createParamDecorator((data, req): AuthUser => {
  return req.user;
});
