/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Injectable,
  PipeTransform,
  ArgumentMetadata
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ValidationErrorException } from '../exceptions';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  public async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const metatype = metadata.metatype;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const constraints = errors[0].constraints;
      const constraintsKeys = Object.keys(errors[0].constraints);
      throw new ValidationErrorException(undefined, constraints[constraintsKeys[0]]);
    }
    return value;
  }

  /**
   * Check if metatype is a native JavaScript type.
   * @param metatype
   */
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
