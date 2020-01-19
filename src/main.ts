import * as helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from './common/pipes';
import { AllExceptionsFilter } from './common/filters';
import { TransformResponseInterceptor } from './common/interceptors';
import { AppLogger } from './modules/app-logger/app-logger.service';
import { AppModule } from './app.module';

const isDev = process.env.NODE_ENV !== 'production';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const module: any;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: isDev ? undefined : false,
    cors: {
      // Refer to 'https://github.com/expressjs/cors#configuration-options' for more options.
      origin: true,
      credentials: true,
      allowedHeaders: ['Authorization', 'Content-Type']
    }
  });
  const configService = app.get<ConfigService>(ConfigService);

  let appLogger: AppLogger | undefined = undefined;
  if (!isDev) {
    appLogger = new AppLogger(configService);
    app.useLogger(appLogger);
  }

  // Helmet can help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately.
  // Refer to 'https://github.com/helmetjs/helmet' for more options.
  app.use(helmet());

  // Node.js CSRF protection middleware.
  // If you need it, you can enable this code.But you should do some extra jobs like cookie.
  // Refer to 'https://github.com/expressjs/csurf#csurf' for more options.
  // Don't forget to install 'csurf' module.
  // app.use(csurf());

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter(appLogger));
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  await app.listen(configService.get<number>('port') || 3000);

  // for webpack hmr
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();

export default bootstrap;
