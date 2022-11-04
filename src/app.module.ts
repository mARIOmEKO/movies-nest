import { Global, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ResetModule } from './reset/reset.module';
@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({isGlobal: true,
      // validationSchema: Joi.object({
      //   DATABASE_HOST: Joi.required(),
      //   DATABASE_PORT: Joi.number().default(5440),
      // })
    }),
    TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    autoLoadEntities: true,
    synchronize: true,
  }), 
  DatabaseModule, AuthModule, UserModule, ResetModule,],
  controllers: [AppController],
  providers: [AppService,
  {
    provide: APP_PIPE,
    useClass: ValidationPipe,
  },
  ],
})
export class AppModule {}