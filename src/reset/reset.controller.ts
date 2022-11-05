import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/users.entity';
import { Repository } from 'typeorm';
import { ResetService } from './reset.service';
import { SendgridService } from './sendgrid.service';
import * as bcrypt from 'bcrypt';

@Controller()
export class ResetController {
    constructor(
        private resetService: ResetService,
        // private mailService: MailerService,
        private sendgridService: SendgridService,
        private authService: AuthService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}
    @Post('forgot')
    async forgot(@Body('email') email: string){
        const token = Math.random().toString(20).substr(2,12);

        await this.resetService.create({
            email,
            token
        })

        const url = `http://localhost:3000/reset/${token}`;
        const mail = {
            to: email,
            subject: 'Password Reset',
            from: 'marioo.meko@gmail.com', 
            text: 'Your email for the password reset',
            html: `Click <a href="${url}>here</a> to reset your password!`

        };

        return await this.sendgridService.send(mail);


        // await this.mailService.sendMail({
        //     from: '<info@ethereal.email>',
        //     to: email,
        //     subject: 'Reset your password',
        //     html: `Clock <a href="${url}>here</a> to reset your password!`
        // })

        // return { message: 'Check your email'}
    }

    @Post('reset')
    async reset(
        @Body('token') token: string, //token do merret nga route pastaj kur te hapi URL, password dhe retyped do ti fusi useri vete
        @Body('password') password: string,
        @Body('password_confirm') password_confirm: string)
        {
            if (password !== password_confirm)
                throw new BadRequestException('Passwords do not match bre')
            const reset = await this.resetService.findOne(token);
            const email = reset.email
            const user = await this.userRepository.findOneBy({email})

            if(!user)
                throw new NotFoundException('User not found')
            
            const hashedPassword = await bcrypt.hash(password,user.salt)

            await this.authService.update(user.id,{password: hashedPassword})
            return {
                message: 'Success'
            }
        }
}
