import { EmailConfig } from 'email-templates';
import { ModuleMetadata, Type } from '@nestjs/common/interfaces';

export type MailerModuleOptions = EmailConfig;

export interface MailerOptionsFactory {
    createMailerOptions(): MailerModuleOptions | Promise<MailerModuleOptions>;
}

export interface MailerModuleAsyncOptions
    extends Pick<ModuleMetadata, 'imports'> {
    useFactory?(
        ...args: any[]
    ): MailerModuleOptions | Promise<MailerModuleOptions>;
    useClass?: Type<MailerOptionsFactory>;
    useExisting?: Type<MailerOptionsFactory>;
    inject?: any[];
}
