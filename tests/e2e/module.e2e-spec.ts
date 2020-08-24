import faker from 'faker';
import Email from 'email-templates';
import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';

import { MailerService } from '../../lib';
import { AppModule } from '../src/app.module';
import { MAILER } from '../../lib/mailer.constant';

describe('MailerModule', () => {
    let module: TestingModule, mailer: Email, mailerService: MailerService;

    describe('test synchronous module registration', () => {
        describe('register()', () => {
            beforeEach(async () => {
                module = await Test.createTestingModule({
                    imports: [AppModule.withRegister()],
                }).compile();
            });

            it('should register redis module', async () => {
                mailer = module.get<Email>(MAILER);
                expect(mailer).toBeInstanceOf(Email);
            });
        });
    });

    describe('test asynchronous module registration', () => {
        describe('useFactory()', () => {
            beforeEach(async () => {
                module = await Test.createTestingModule({
                    imports: [AppModule.withUseFactoryRegisterAsync()],
                }).compile();
            });

            it('should register redis module', async () => {
                mailer = module.get(MAILER);
                expect(mailer).toBeInstanceOf(Email);
            });
        });

        describe('useClass', () => {
            beforeEach(async () => {
                module = await Test.createTestingModule({
                    imports: [AppModule.withUseClassRegisterAsync()],
                }).compile();
            });

            it('should register redis module', async () => {
                mailer = module.get(MAILER);
                expect(mailer).toBeInstanceOf(Email);
            });

            it('juiceResource()', () => {
                const result = faker.random.word();
                (Email.prototype as any).juiceResource = jest
                    .fn()
                    .mockResolvedValueOnce(result);
                mailerService = module.get<MailerService>(MailerService);

                mailerService.juiceResource('').subscribe({
                    next: response => expect(response).toBe(result),
                });
            });

            it('render()', () => {
                const result = faker.random.word();
                (Email.prototype as any).render = jest
                    .fn()
                    .mockResolvedValueOnce(result);
                mailerService = module.get<MailerService>(MailerService);

                mailerService.render('view').subscribe({
                    next: response => expect(response).toBe(result),
                });
            });

            it('renderAll()', () => {
                const result = faker.random.word();
                (Email.prototype as any).renderAll = jest
                    .fn()
                    .mockResolvedValueOnce(result);
                mailerService = module.get<MailerService>(MailerService);

                mailerService.renderAll('').subscribe({
                    next: response => expect(response).toBe(result),
                });
            });

            it('send()', () => {
                const result = faker.random.word();
                (Email.prototype as any).send = jest
                    .fn()
                    .mockResolvedValueOnce(result);
                mailerService = module.get<MailerService>(MailerService);

                mailerService
                    .send({
                        message: { to: 'receiver@example.org' },
                        template: 'example',
                    })
                    .subscribe({
                        next: response => expect(response).toBe(result),
                    });
            });

            it('getTemplatePath()', () => {
                const result = faker.random.word();
                (Email.prototype as any).getTemplatePath = jest
                    .fn()
                    .mockResolvedValueOnce(result);
                mailerService = module.get<MailerService>(MailerService);

                mailerService.getTemplatePath('template').subscribe({
                    next: response => expect(response).toBe(result),
                });
            });

            it('templateExists()', () => {
                const result = faker.random.arrayElement([true, false]);
                (Email.prototype as any).templateExists = jest
                    .fn()
                    .mockResolvedValueOnce(result);
                mailerService = module.get<MailerService>(MailerService);

                mailerService.templateExists('view').subscribe({
                    next: response => expect(response).toBe(result),
                });
            });

            it('checkAndRender()', () => {
                const result = faker.random.word();
                (Email.prototype as any).checkAndRender = jest
                    .fn()
                    .mockResolvedValueOnce(result);
                mailerService = module.get<MailerService>(MailerService);

                mailerService.checkAndRender('html', 'random').subscribe({
                    next: response => expect(response).toBe(result),
                });
            });

            it('test error', () => {
                const errorDesc = faker.random.words();
                (Email.prototype as any).checkAndRender = jest
                    .fn()
                    .mockRejectedValueOnce(
                        new InternalServerErrorException(errorDesc),
                    );
                mailerService = module.get<MailerService>(MailerService);

                mailerService.checkAndRender('html', 'random').subscribe({
                    error: error => {
                        expect(error).toBeInstanceOf(
                            InternalServerErrorException,
                        );
                        expect(error.message).toBe(errorDesc);
                    },
                });
            });
        });
    });
});
