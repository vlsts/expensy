import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsStringOrUUIDConstraint implements ValidatorConstraintInterface {
    validate(value: any) {
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return (
            typeof value === 'string' &&
            (uuidRegex.test(value) || value.length > 0)
        );
    }

    defaultMessage() {
        return 'Value must be either a valid UUID or a non-empty string';
    }
}

export function IsStringOrUUID(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'isStringOrUUID',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsStringOrUUIDConstraint,
        });
    };
}
