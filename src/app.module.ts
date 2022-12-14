import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join, resolve } from 'path';
import { typeOrmAsyncConfig } from './config/typeorm.config';
import { AppLoggerMiddleware } from './middlewares/logger';
import AuthModule from './modules/auth/auth.module';
import ChatModule from './modules/chat/chat.module';
import CompanyModule from './modules/company/company.module';
import DepartmentModule from './modules/department/department.module';
import FilesModule from './modules/files/files.module';
import MessagesModule from './modules/messages/messages.module';
import UserModule from './modules/user/user.module';
import WalkieTalkieModule from './modules/walkie-talkie/walkie-talkie.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${process.cwd()}/${process.env.NODE_ENV}.env`],
      isGlobal: true,
      cache: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(join(__dirname, '..', 'docs')),
      serveRoot: '/ws/docs'
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    AuthModule,
    UserModule,
    CompanyModule,
    DepartmentModule,
    MessagesModule,
    WalkieTalkieModule,
    ChatModule,
    FilesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
