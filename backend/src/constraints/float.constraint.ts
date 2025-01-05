import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: false })
class IsFloatConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return typeof value === 'number' && !isNaN(value);
  }

  defaultMessage() {
    return 'Value must be a float';
  }
}

export function IsFloat(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isFloat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsFloatConstraint,
    });
  };
}
