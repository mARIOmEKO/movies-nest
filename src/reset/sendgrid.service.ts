import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class SendgridService {
    constructor(private readonly configService: ConfigService) {
        SendGrid.setApiKey(process.env.SENDGRID_API_KEY);
    }

    async send(mail: SendGrid.MailDataRequired) {
        const transport = await SendGrid.send(mail);

        console.log(`Email successfully dispatched to ${mail.to}`)
        return transport;
    }
}