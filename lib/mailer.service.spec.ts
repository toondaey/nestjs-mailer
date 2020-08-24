import faker from 'faker';
import { Test, TestingModule } from '@nestjs/testing';

import { MAILER } from './mailer.constant';
import { MailerService } from './mailer.service';

describe('MailerService', () => {
    let service: MailerService;
    let mailer: Record<string, any>;

    beforeEach(async () => {
        mailer = {};

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: MAILER,
                    useValue: mailer,
                },
                MailerService,
            ],
        }).compile();

        service = module.get<MailerService>(MailerService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('juiceResource', done => {
        const result = faker.random.word();

        mailer.juiceResource = jest.fn().mockResolvedValue(result);

        const observable = service.juiceResource('html');

        observable.subscribe({
            next(res) {
                expect(res).toBe(result);
                expect(mailer.juiceResource).toBeCalledTimes(1);
            },
            complete: done,
        });
    });

    it('render', done => {
        const result = faker.random.word();

        mailer.render = jest.fn().mockResolvedValue(result);

        const observable = service.render('html', { a: 'b' });

        observable.subscribe({
            next(res) {
                expect(res).toBe(result);
                expect(mailer.render).toBeCalledTimes(1);
            },
            complete: done,
        });
    });

    it('renderAll', done => {
        const result = { html: 'abcde' };

        mailer.renderAll = jest.fn().mockResolvedValue(result);

        const observable = service.renderAll('html', { a: 'b' });

        observable.subscribe({
            next(res) {
                expect(res).toEqual(
                    expect.objectContaining({ html: result.html }),
                );
                expect(mailer.renderAll).toBeCalledTimes(1);
            },
            complete: done,
        });
    });

    it('send', done => {
        const result = faker.random.word();

        mailer.send = jest.fn().mockResolvedValue(result);

        const observable = service.send({
            message: { to: 'example@test.org' },
            template: 'random',
        });

        observable.subscribe({
            next(res) {
                expect(res).toBe(result);
                expect(mailer.send).toBeCalledTimes(1);
            },
            complete: done,
        });
    });

    it('getTemplatePath', done => {
        const result = faker.system.filePath();

        mailer.getTemplatePath = jest.fn().mockResolvedValue(result);

        const observable = service.getTemplatePath('template');

        observable.subscribe({
            next(res) {
                expect(res).toBe(result);
                expect(mailer.getTemplatePath).toBeCalledTimes(1);
            },
            complete: done,
        });
    });

    it('templateExists', done => {
        const result = faker.random.arrayElement([true, false]);

        mailer.templateExists = jest.fn().mockResolvedValue(result);

        const observable = service.templateExists('template');

        observable.subscribe({
            next(res) {
                expect(res).toBe(result);
                expect(mailer.templateExists).toBeCalledTimes(1);
            },
            complete: done,
        });
    });

    it('checkAndRender', done => {
        const result = faker.random.arrayElement([true, false]);

        mailer.checkAndRender = jest.fn().mockResolvedValue(result);

        const observable = service.checkAndRender('html', 'template', {
            a: 'b',
        });

        observable.subscribe({
            next(res) {
                expect(res).toBe(result);
                expect(mailer.checkAndRender).toBeCalledTimes(1);
            },
            complete: done,
        });
    });
});
