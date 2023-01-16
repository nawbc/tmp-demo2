import { Body, Controller, Get, Injectable, Post, Scope } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ name: 'IsEntityExistedConstraint', async: true })
class IsEntityExistedConstraint implements ValidatorConstraintInterface {
  constructor(private readonly app: AppService) {}

  validate(name: any, _args: ValidationArguments) {
    console.log(this.app, '==================================');
    return false;
    //   return this.dataSource
    //     .getRepository(entity)
    //     .findOne({
    //       where: {
    //         [key]: name,
    //       },
    //     })
    //     .then((e) => {
    //       return !e;
    //     });
  }
}

/**
 *  Check if the target entity is existed.
 * @param {string} key The database field.
 * @param {ValidationOptions} validationOptions
 */

//TODO: fix https://github.com/nestjs/nest/issues/528
export function IsEntityExisted(
  entity?: any,
  key?: string,
  validationOptions?: any,
) {
  return function (object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEntityExistedConstraint,
    });
  };
}

class DemoDto {
  @IsEntityExisted()
  name: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  getHello(@Body() body: DemoDto): string {
    console.log(body);
    return this.appService.getHello();
  }
}
