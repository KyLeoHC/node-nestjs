import * as helmet from 'helmet';
// import * as csurf from 'csurf';
import { NestFactory } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters';
import { TransformInterceptor } from './common/interceptors';
import { AppModule } from './app.module';
import getConfig from '../config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const module: any;
const config = getConfig();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    cors: {
      // refer to 'https://github.com/expressjs/cors#configuration-options' for more options
      credentials: true,
      allowedHeaders: []
    }
  });

  // Helmet can help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately.
  // refer to 'https://github.com/helmetjs/helmet' for more options
  app.use(helmet());

  // Node.js CSRF protection middleware.
  // If you need it, you can enable this code.But you should do some extra jobs like cookie.
  // refer to 'https://github.com/expressjs/csurf#csurf' for more options
  // app.use(csurf());

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(config.port);

  // for webpack hmr
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
