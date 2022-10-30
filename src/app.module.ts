import { Global, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { APP_PIPE } from '@nestjs/core';
import { UsersModule } from './users/users.module';
@Module({
  imports: [UsersModule,
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
  DatabaseModule,],
  controllers: [AppController],
  providers: [AppService,
  {
    provide: APP_PIPE,
    useClass: ValidationPipe,
  },
  ],
})
export class AppModule {}