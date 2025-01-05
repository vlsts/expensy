import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
  } from 'class-validator';
  
  @ValidatorConstraint({ async: false })
  export class IsBufferConstraint implements ValidatorConstraintInterface {
    validate(value: any): boolean {
      return Buffer.isBuffer(value);
    }
  
    defaultMessage(): string {
      return 'Value must be a Buffer';
    }
  }
  
  export function IsBuffer(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'isBuffer',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: IsBufferConstraint,
      });
    };
  }
  