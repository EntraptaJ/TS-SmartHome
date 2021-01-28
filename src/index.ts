/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/index.ts
import fastify from 'fastify';
import hyperid from 'hyperid';
import './setup';
import { logger, LogMode } from './Library/Logger';
import Container from 'typedi';
/* import { Client as GRPCReflectionClient } from 'grpc-reflection-js';
import {
  AnyNestedObject,
  IParseOptions,
  Message,
  Root,
  RootConstructor,
} from 'protobufjs';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader'; */

/* const serverAddress = '192.168.100.1:9200';

const creds = grpc.credentials.createInsecure();

console.log('Creds: ', creds);

const reflectionClient = new GRPCReflectionClient(serverAddress, creds, {});

const services = (await reflectionClient.listServices()) as string[];

console.log('Services: ', services);

const root = new Root();

const serviceRoots = await Promise.all(
  services
    .filter((s) => s && s !== 'grpc.reflection.v1alpha.ServerReflection')
    .map((service) => reflectionClient.fileContainingSymbol(service)),
);

serviceRoots.forEach((serviceRoot: Root) => {
  if (serviceRoot.nested) {
    for (const namespace in serviceRoot.nested) {
      console.log('nameSpace: ', namespace);
      if (Object.prototype.hasOwnProperty.call(serviceRoot.nested, namespace)) {
        const field =
          serviceRoot.nested[namespace].API.Device.Request.fields
            .signed_request;
        console.log(
          'FuckerHell: ',
          serviceRoot.nested[
            namespace
          ].API.Device.Request.oneofs.request.remove(field),
        );
        root.add(serviceRoot.nested[namespace]);
      }
    }
  }
});

const replaceKeys = [
  '.SpaceX.API.Device.Request.signed_request',
  '.SpaceX.API.Device.Request.get_next_id',
  '.SpaceX.API.Device.Response.get_next_id',
  '.SpaceX.API.Device.Request.dish_stow',
  '.SpaceX.API.Device.Request.authenticate',
  '.SpaceX.API.Device.Response.dish_authenticate',
  '.SpaceX.API.Device.Response.dish_get_history',
  '.SpaceX.API.Device.Response.dish_get_status',
  '.SpaceX.API.Device.Response.dish_stow',
  '.SpaceX.API.Device.Response.wifi_authenticate',
  '.SpaceX.API.Device.Response.wifi_get_clients',
  '.SpaceX.API.Device.Response.wifi_get_history',
  '.SpaceX.API.Device.Response.wifi_get_ping_metrics',
  '.SpaceX.API.Device.Response.wifi_get_status',
  '.SpaceX.API.Device.Response.wifi_set_config',
  '.SpaceX.API.Device.Response.wifi_setup',
  '.SpaceX.API.Device.Request.wifi_get_clients',
  '.SpaceX.API.Device.Request.wifi_get_ping_metrics',
  '.SpaceX.API.Device.Request.wifi_set_config',
  '.SpaceX.API.Device.Request.wifi_setup',
  '.SpaceX.API.Device.Response.status',
  '.SpaceX.API.Device.Event.wifi_new_client_connected',
  '.SpaceX.API.Device.Event.wifi_account_bonding',
];

const newType = '.SpaceX.API.Device.GetDeviceInfoRequest';

for (const replaceKey of replaceKeys) {
  const service = root.lookup(replaceKey);

  service.type = '.SpaceX.API.Device.GetDeviceInfoRequest';
} */

// root.remove(fucker.fields.signed_request);

// const descriptorSet = root.toDescriptor('proto3');

// console.log(descriptorSet);

/* for (const serviceRoot of serviceRoots) {
  const service = serviceRoot.lookupService('SpaceX.API.Device.Device');

  const libraryApiPackageDefinition = protoLoader.loadFileDescriptorSetFromObject(
    service.toJSON(),
    {
      enums: String,
    },
  );

  console.log('packageDef: ', libraryApiPackageDefinition);

  const libraryApi = grpc.loadPackageDefinition(libraryApiPackageDefinition);

  console.log(`Library API: `, libraryApi);
} */

/* 
for (const serviceRoot of serviceRoots) {
  console.log(serviceRoot);
}
 */
/* const test = ModuleRpcProtocolClient.getRpcClient(services, {
  remoteAddress: `http://192.168.100.1:9200`,
  // This "transport" allows the code to run in NodeJS instead of running
  // in the browser.
  getGrpcWebTransport: NodeHttpTransport(),
});

console.log(test); */

if (process.env.NODE_ENV !== 'production') {
  const { config } = await import('dotenv');

  logger.log(LogMode.DEBUG, `Loading .env file`);

  /**
   * Load .env file from disk
   */
  config();

  logger.log(LogMode.DEBUG, `Loaded .env file`);
}

/**
 * For some reason if I import in the top level it doesn't get affected by dotenv loading,
 * even if I seperately dynamic import after if there is a top level import already it's locked with default values not affected by dotenv config
 */
const [
  { config },
  { connectDatabase },
  { createApolloServer },
] = await Promise.all([
  import('./Library/Config'),
  import('./Library/Database'),
  import('./Library/Apollo'),
]);

logger.log(LogMode.INFO, 'test', config);

/**
 * Fastify Web Server
 */
const webServer = fastify({
  /**
   * Unique UUIDs for each request for logging and tracking
   */
  genReqId: () => hyperid().uuid,
});

// await webServer.register(fastifyExpress);

logger.log(LogMode.INFO, 'Connecting to database');

await connectDatabase();

logger.log(LogMode.INFO, 'Database connected. Creating GraphQL Server');

const gqlServer = await createApolloServer();

await webServer.register(gqlServer.createHandler());

// await createGQLServer(GQLServerType.APOLLO, webServer);

logger.log(LogMode.DEBUG, `Starting weather checking que`);

const [
  { PowerUsageController },
  { WeatherController },
  { SensorController },
] = await Promise.all([
  import('./Modules/Power/PowerUsageController'),
  import('./Modules/Weather/WeatherController'),
  import('./Modules/Sensors/SensorController'),
]);

const weatherController = new WeatherController('on-135');

await weatherController.startCheckerQue();

const powerUsageCollector = Container.get(PowerUsageController);

await powerUsageCollector.startPowerUsageCollector();

const sensorController = Container.get(SensorController);

await sensorController.startSensorCollector();

/*
const gqlServer = await createApolloServer();

await webServer.register(gqlServer.createHandler()); */

/* const { alexaExpressAdapter } = await createSkillBuilder();

webServer.express.post('/', alexaExpressAdapter.getRequestHandlers()); */

logger.log(LogMode.INFO, 'API Server setup.');

// const devices = await wyze.getDeviceList();

// const livingRoomCamera = await wyze.getDeviceByName('Living Room Cam');

await webServer.listen('8088', config.bindHost);

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
