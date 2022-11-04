import { Module } from '@nestjs/common';
import { ResetService } from './reset.service';
import { ResetController } from './reset.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reset } from './reset.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { SendgridService } from './sendgrid.service';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/users.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [ResetService, SendgridService,AuthService,JwtService],
  imports: [
    
    TypeOrmModule.forFeature([Reset,User]),
    // MailerModule.forRoot({
    //   transport: {
    //     host: 'smtp.ethereal.email',
    //   port: 587,
    //   auth: {
    //     user: 'valentine.harris32@ethereal.email',
    //     pass: '2CdVhM6Zffj3xdSTaV'
    // }
        // }})
        
      // defaults: {
        // from: 'hugh72@ethereal.email',
      // }
  ],
  controllers: [ResetController]
})
export class ResetModule {}
