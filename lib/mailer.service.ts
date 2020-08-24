import { Observable, Subscriber } from 'rxjs';
import { Injectable, Inject } from '@nestjs/common';
import Email, { EmailOptions, EmailMessage } from 'email-templates';

import { MAILER } from './mailer.constant';

@Injectable()
export class MailerService {
    constructor(@Inject(MAILER) private readonly mailer: Email) {}

    juiceResource(html: string): Observable<string> {
        return this.makeObservable<string>('juiceResource', html);
    }

    render<T = Record<string, any>>(
        view: string,
        locals?: T,
    ): Observable<string> {
        return this.makeObservable<string, T>('render', view, locals);
    }

    renderAll<T = Record<string, any>>(
        view: string,
        locals?: T,
    ): Observable<Partial<EmailMessage>> {
        return this.makeObservable<Partial<EmailMessage>, T>(
            'renderAll',
            view,
            locals,
        );
    }

    send<T = Record<string, object>>(
        options: EmailOptions<T>,
    ): Observable<string> {
        return this.makeObservable<any>('send', options);
    }

    getTemplatePath(template: string): Observable<string> {
        return this.makeObservable<string>('getTemplatePath', template);
    }

    templateExists(view: string): Observable<boolean> {
        return this.makeObservable<boolean>('templateExists', view);
    }

    checkAndRender<T = Record<string, any>>(
        type: keyof EmailMessage,
        template: string,
        locals?: T,
    ): Observable<string> {
        return this.makeObservable<string, T>(
            'checkAndRender',
            type,
            template,
            locals,
        );
    }

    private makeObservable<T, U = Record<string, any>>(
        method: 'checkAndRender',
        type: string,
        template: string,
        locals?: U,
    ): Observable<T>;
    private makeObservable<T>(
        method: 'juiceResource' | 'getTemplatePath' | 'templateExists',
        html: string,
    ): Observable<T>;
    private makeObservable<T, U = Record<string, any>>(
        method: 'render',
        view: string,
        locals?: U,
    ): Observable<T>;
    private makeObservable<T, U = Record<string, any>>(
        method: 'renderAll',
        view: string,
        locals?: U,
    ): Observable<T>;
    private makeObservable<T, U = Record<string, any>>(
        method: 'send',
        options: EmailOptions<U>,
    ): Observable<T>;
    private makeObservable<T>(
        method:
            | 'juiceResource'
            | 'render'
            | 'renderAll'
            | 'send'
            | 'getTemplatePath'
            | 'templateExists'
            | 'checkAndRender',
        ...args: any[]
    ): Observable<T> {
        return new Observable((subscriber: Subscriber<any>) => {
            this.mailer[method](...args)
                .then(result => {
                    subscriber.next(result);
                    subscriber.complete();
                })
                .catch(error => {
                    subscriber.error(error);
                    subscriber.complete();
                });
        });
    }
}
