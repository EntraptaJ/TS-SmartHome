import { AttributesManager, ResponseBuilder } from 'ask-sdk-core';
import { RequestEnvelope, services } from 'ask-sdk-model';
import { ContainerInstance } from 'typedi';
import { PillService } from '../../Modules/Pills/PillService';

interface Context {
  Container: ContainerInstance;

  pillService: PillService;
}

export interface HandlerInput {
  requestEnvelope: RequestEnvelope;
  context: Context;
  attributesManager: AttributesManager;
  responseBuilder: ResponseBuilder;
  serviceClientFactory?: services.ServiceClientFactory;
}
