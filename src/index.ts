// src/index.ts
import fastify from 'fastify';
import hyperid from 'hyperid';
import 'reflect-metadata';
import { createApolloServer } from './Library/Apollo';
import { logger, LogMode } from './Library/Logger';

if (process.env.NODE_ENV !== 'production') {
  const { config } = await import('dotenv');

  /**
   * Load .env file from disk
   */
  config();
}

/**
 * For some reason if I import in the top level it doesn't get affected by dotenv loading,
 * even if I seperately dynamic import after if there is a top level import already it's locked with default values not affected by dotenv config
 */
const { config } = await import('./Library/Config');

/**
 * Fastify Web Server
 */
const webServer = fastify({
  /**
   * Unique UUIDs for each request for logging and tracking
   */
  genReqId: () => hyperid().uuid,
});

const gqlServer = await createApolloServer();

await webServer.register(gqlServer.createHandler());

logger.log(LogMode.INFO, 'API Server setup.');

// const devices = await wyze.getDeviceList();

// const livingRoomCamera = await wyze.getDeviceByName('Living Room Cam');

await webServer.listen(config.bindPort, config.bindHost);

logger.log(LogMode.INFO, 'Listening on port 8080');

// logger.log(LogMode.INFO, `Living room camera: `, livingRoomCamera);

// async function logCameraThumbnailToConsole(deviceName: string): Promise<void> {
//   const livingRoomCamera = await wyze.getDeviceByName(deviceName);

//   const body = await got(
//     livingRoomCamera.device_params.camera_thumbnails.thumbnails_url,
//   ).buffer();

//   logger.log(LogMode.INFO, await terminalImage.buffer(body));
// }

// setInterval(() => {
//   logCameraThumbnailToConsole('Living Room Cam').catch((err) => {
//     logger.log(LogMode.ERROR, `Log camera to console has failed.`, err);
//   });
// }, 300000);
export {};
