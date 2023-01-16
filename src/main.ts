import { ValidationPipe } from '@nestjs/common';
import { NestApplicationContext, NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { Module } from '@nestjs/common';
import { Body, Controller, Injectable, Post } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
} from 'class-validator';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

@Injectable()
@ValidatorConstraint({ async: true })
class IsEntityExistedConstraint implements ValidatorConstraintInterface {
  constructor(private readonly app: AppService) {}

  validate(name: any, _args: ValidationArguments) {
    console.log(this.app, '==================================');
    return false;
  }
}

/**
 *  Check if the target entity is existed.
 * @param {string} key The database field.
 * @param {ValidationOptions} validationOptions
 */
export function IsEntityExisted(validationOptions?: any) {
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

@Injectable()
class Demo1Service {
  constructor(private readonly app: AppService) {}
  demo() {
    this.app.getHello();
  }
}

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, Demo1Service, NestApplicationContext],
})
export class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  useContainer(app.select(AppModule), {
    fallbackOnErrors: true,
  });

  console.log('useContainer:', Date.now());

  await app.listen(3000);
}
bootstrap();
