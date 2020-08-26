# Nestjs Mailer

This is a mailer package built for nestjs leveraging the power of the observer pattern (i.e. [Observable][observable] package). It is a simple nestjs API to the [email-templates] npm package which in turn uses [nodemailer] but simplified to use your preferred template engine. It also uses the [juice] npm package to inline the css from your css file.

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<details>
<summary><strong>Table of content</strong> (click to expand)</summary>

<!-- toc -->

-   [Installation](#installation)
-   [Usage](#usage)
-   [Configuration](#configuration)
-   [API Methods](#api-methods)
-   [Contributing](#contributing)
    <!-- tocstop -->
    </details>

## Installation

Installation is as simple as running:

`npm install @t00nday/nestjs-mailer`

or

`yarn add @t00nday/nestjs-mailer`

## Usage

A basic usage example:

1. Register the module as a dependency:

This could be done synchronously using the `register()` method:

`./app.module.ts`

```ts
import { Module } from '@nestjs/common';
import { MailerModule } from '@t00nday/nestjs-mailer';

@Module({
    imports: [
        // ... other modules
        MailerModule.register({
            message: {
                from: 'test@example.org',
                // ...
            },
            // ...
        }),
    ],
})
export class AppModule {}
```

The module could also be registered asynchronously using any of the approaches provided by the `registerAsync()` method:

Examples below:

-   Using factory provider approach

`./app.module.ts`

```ts
// prettier-ignore
import { 
    MailerModule, 
    MailerModuleOptions 
} from '@t00nday/nestjs-mailer';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        // ... other modules
        MailerModule.registerAsync({
            useFactory: (): MailerModuleOptions => ({
                message: {
                    from: 'test@example.org',
                    // ...
                },
                // ...
            }),
        }),
    ],
})
export class AppModule {}
```

-   Using class or existing provider approach:

`./mailer-config.service.ts`

```ts
import {
    MailerModuleOptions,
    MailerOptionsFactory,
} from '@t00nday/nestjs-mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailerConfigService implements MailerOptionsFactory {
    createMailerOptions(): MailerModuleOptions {
        return {
            message: {
                from: 'test@example.org',
                // ...
            },
            // ...
        };
    }
}
```

The `MailerConfigService` **SHOULD** implement the `MailerOptionsFactory`, **MUST** declare the `createMailerOptions()` method and **MUST** return `MailerModuleOptions` object.

`./app.module.ts`

```ts
// prettier-ignore
import {
    MailerModule,
    MailerModuleOptions
} from '@t00nday/nestjs-mailer';
import { Module } from '@nestjs/common';

import { MailerConfigService } from './mailer-config.service.ts';

@Module({
    imports: [
        // ... other modules
        MailerModule.registerAsync({
            useClass: MailerConfigService,
        }),
    ],
})
export class AppModule {}
```

2. Inject the `MailerService` as a dependency:

`./app.service.ts`

```ts
import { Observable } from 'rxjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    constructor(
        // ...other dependencies...
        private readonly mailerService: MailerService,
    ) {}

    sendMail(): Observable<string> {
        this.mailerService.send({
            message: {
                to: 'receiver@example.org',
                // ...
            },
            template: 'welcome',
            // ...
        });
    }
}
```

## Configuration

As mentioned above, this package is built as an API to the email-templates npm package hence the configuration is just the same as that of the original package. The bootstrap `MailerModuleOptions` is an alias for the `EmailConfig` (this can be found by intalling `@types/email-templates` using`npm i -D @types/email-templates`) declaration. This is properly documented [here][email-templates-options].

## API Methods

As highlighted above, after registering the module, the `MailerService` is the gateway to access the module APIs hence, the instruction above to inject it into our class. This attempts to cover the methods provided by the mailer service - most similar to the implementations by the `email-templates` package and some not covered by the packages documentation.

The following methods share the same implementation architecture as the original packages so can be called as referenced in the email-templates package:

-   `send<T = Record<string, any>(options: EmailOptions<T>): Observable<string>`

-   `juiceResource(html: string): Observable<string>`

-   `render<T = Record<string, any>>(view: string, locals: T): Observable<string>`

-   `renderAll(): Observable<string>`

Other methods not documented in the package are detailed below:

-   `getTemplatePath(template: string): Observable<string>`: This returns the path to a template (the only string argument provided to the method). This is returned as a `Observable<string>`.

-   `templateExists(view: string): Observable<boolean>`: This return an `Observable<boolean>` indicating if a template for a view exists or otherwise.

-   `checkAndRender<T = Record<string, any>>(type: keyof EmailMessage, template: string, locals: T): Observable<string>`: This renders and returns `Observable<string>` if a template exists with the type (i.e. html, subject, text).

Further documentation and understanding of the `email-templates` package can be found on the packages [documentation][email-templates].

## Contributing

Please read the contribution's [guide](./Contributing.md).

[observable]: https://rxjs-dev.firebaseapp.com/guide/overview
[email-templates]: https://www.npmjs.com/package/email-templates
[email-templates-options]: https://github.com/forwardemail/email-templates#options
[nodemailer]: https://www.npmjs.com/package/nodemailer
[juice]: https://www.npmjs.com/package/juice
