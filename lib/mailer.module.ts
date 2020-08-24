import { MailerService } from './mailer.service';
import { Module, DynamicModule, Provider, Type } from '@nestjs/common';

import {
    MailerModuleOptions,
    MailerOptionsFactory,
    MailerModuleAsyncOptions,
} from './mailer.interface';
import Email from 'email-templates';
import { MAILER_OPTIONS, MAILER } from './mailer.constant';

@Module({
    providers: [MailerService],
    exports: [MailerService],
})
export class MailerModule {
    static register(options: MailerModuleOptions): DynamicModule {
        return {
            module: MailerModule,
            providers: [
                { provide: MAILER_OPTIONS, useValue: options },
                {
                    provide: MAILER,
                    useFactory: (config: MailerModuleOptions) =>
                        new Email(config),
                    inject: [MAILER_OPTIONS],
                },
            ],
        };
    }

    static registerAsync(options: MailerModuleAsyncOptions): DynamicModule {
        return {
            module: MailerModule,
            providers: [
                ...this.createAsyncProviders(options),
                {
                    provide: MAILER,
                    useFactory: (config: MailerModuleOptions) =>
                        new Email(config),
                    inject: [MAILER_OPTIONS],
                },
            ],
            imports: options.imports || [],
        };
    }

    static createAsyncProviders(options: MailerModuleAsyncOptions): Provider[] {
        if (options.useFactory || options.useExisting) {
            return [this.createAsyncOptionsProvider(options)];
        }

        const useClass = options.useClass as Type<MailerOptionsFactory>;

        return [
            this.createAsyncOptionsProvider(options),
            { provide: useClass, useClass },
        ];
    }

    static createAsyncOptionsProvider(
        options: MailerModuleAsyncOptions,
    ): Provider {
        if (options.useFactory) {
            return {
                provide: MAILER_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }

        const inject = [
            (options.useClass || options.useExisting) as Type<
                MailerOptionsFactory
            >,
        ];

        return {
            provide: MAILER_OPTIONS,
            useFactory: (factory: MailerOptionsFactory) =>
                factory.createMailerOptions(),
            inject,
        };
    }
}
