import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './config/typeorm.config';
import { AppLoggerMiddleware } from './middlewares/logger';
import AuthModule from './modules/auth/auth.module';
import CompanyModule from './modules/company/company.module';
import DepartmentModule from './modules/department/department.module';
import MessagesModule from './modules/messages/messages.module';
import UserModule from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${process.cwd()}/${process.env.NODE_ENV}.env`],
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    AuthModule,
    UserModule,
    CompanyModule,
    DepartmentModule,
    MessagesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
