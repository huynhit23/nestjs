import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { SocketIOAdapter } from './socket-io-adapter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  const configService = app.get(ConfigService);
  const port = parseInt(configService.get('PORT'));
  const clientPort = parseInt(configService.get('CLIENT_PORT'));
  app.enableCors({
    origin: `http://localhost:4200`,
    methods: ["GET", "POST"],
    credentials: true,
  });
  app.useWebSocketAdapter(new SocketIOAdapter(app, configService));
  
  const config = new DocumentBuilder()
    .setTitle('voting_app')
    .setDescription('voting-app description')
    .setVersion('1.0')
    .addTag('vote')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // decorator chưa ăn
  
  
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  
  await app.listen(3000, function(){
    console.log(`máy chủ : http://localhost:${port}`)
  });
  
}
bootstrap();
