// src/index.ts
import fastify from 'fastify';
import got from 'got';
import hyperid from 'hyperid';
import 'reflect-metadata';
import terminalImage from 'terminal-image';
import { createApolloServer } from './Library/Apollo';
import { config } from './Library/Config';
import { logger, LogMode } from './Library/Logger';
import { wyze } from './Library/Wyze';

if (process.env.NODE_ENV !== 'production') {
  const { config } = await import('dotenv');

  config();
}

/**
 * Fastify Web Server
 */
const webServer = fastify({
  genReqId: () => hyperid().uuid,
});

const gqlServer = await createApolloServer();

await webServer.register(gqlServer.createHandler());

logger.log(LogMode.INFO, 'API Server setup.');

// const devices = await wyze.getDeviceList();

const livingRoomCamera = await wyze.getDeviceByName('Living Room Cam');

await webServer.listen(config.bindPort, config.bindHost);

logger.log(LogMode.INFO, 'Listening on port 8080');

logger.log(LogMode.INFO, `Living room camera: `, livingRoomCamera);

async function logCameraThumbnailToConsole(deviceName: string): Promise<void> {
  const livingRoomCamera = await wyze.getDeviceByName(deviceName);

  const body = await got(
    livingRoomCamera.device_params.camera_thumbnails.thumbnails_url,
  ).buffer();

  logger.log(LogMode.INFO, await terminalImage.buffer(body));
}

setInterval(() => {
  logCameraThumbnailToConsole('Living Room Cam').catch((err) => {
    logger.log(LogMode.ERROR, `Log camera to console has failed.`, err);
  });
}, 300000);

logger.log(LogMode.INFO, `Starting TS-Core`);

export {};
