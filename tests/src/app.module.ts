import { Module, DynamicModule } from '@nestjs/common';

import { MailerModule } from '../../lib';
import { MAILER_CONFIG } from '../shared/mailerConfig';
import { MailerConfigService } from './mailer-config.service';

@Module({})
export class AppModule {
    static withRegister(): DynamicModule {
        return {
            module: AppModule,
            imports: [MailerModule.register(MAILER_CONFIG)],
        };
    }

    static withUseFactoryRegisterAsync(): DynamicModule {
        return {
            module: AppModule,
            imports: [
                MailerModule.registerAsync({
                    useFactory: () => MAILER_CONFIG,
                }),
            ],
        };
    }

    static withUseClassRegisterAsync(): DynamicModule {
        return {
            module: AppModule,
            imports: [
                MailerModule.registerAsync({
                    useClass: MailerConfigService,
                }),
            ],
        };
    }
}
