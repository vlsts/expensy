import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
  } from 'class-validator';

import { Currency } from 'src/expenses/currency.enum';

  @ValidatorConstraint({ async: false })
  export class IsCurrencyConstraint implements ValidatorConstraintInterface {
    validate(value: any) {
      return Object.values(Currency).includes(value);
    }
  
    defaultMessage() {
      return 'Value must be a valid currency';
    }
  }
  
  export function IsEnumValue(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'isCurrency',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: IsCurrencyConstraint,
      });
    };
  }
  