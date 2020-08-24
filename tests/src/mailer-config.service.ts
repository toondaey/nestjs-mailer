import { Injectable } from '@nestjs/common';
import { MAILER_CONFIG } from '../shared/mailerConfig';
import { MailerOptionsFactory, MailerModuleOptions } from '../../lib';

@Injectable()
export class MailerConfigService implements MailerOptionsFactory {
    createMailerOptions(): MailerModuleOptions {
        return MAILER_CONFIG;
    }
}
