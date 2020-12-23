// src/Modules/Pills/TakePillIntent.ts
import { RequestHandler } from 'ask-sdk';
import { parse } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { isValidNameError } from 'graphql';
import { HandlerInput } from '../../Library/Alexa/RequestInput';
import { config } from '../../Library/Config';
import { logger, LogMode } from '../../Library/Logger';
import { isError, IsIntent } from '../../Utils/Helpers';
import { IntentTypes } from '../../Utils/IntentTypes';
import { getPillIdFromSlot } from './getPill';

export const TakePillIntent: RequestHandler = {
  canHandle(handlerInput: HandlerInput) {
    return IsIntent(handlerInput, IntentTypes.TakePill);
  },
  async handle(handlerInput: HandlerInput) {
    logger.log(
      LogMode.DEBUG,
      `TakePillIntent handle() handlerInput: `,
      handlerInput,
    );

    if ('intent' in handlerInput.requestEnvelope.request) {
      const { slots } = handlerInput.requestEnvelope.request.intent;

      if (typeof slots?.pill !== 'undefined') {
        const pillId = getPillIdFromSlot(slots.pill);

        const pill = await handlerInput.context.pillService.findOne(pillId);

        let takenDate: Date | undefined;

        if (
          typeof slots?.time !== 'undefined' &&
          typeof slots?.time.value !== 'undefined'
        ) {
          const serviceClientFactory = handlerInput.serviceClientFactory;
          const deviceId =
            handlerInput.requestEnvelope.context.System.device?.deviceId;

          if (typeof deviceId === 'string') {
            let userTimeZone: string;

            try {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const upsServiceClient = serviceClientFactory!.getUpsServiceClient();

              userTimeZone = await upsServiceClient.getSystemTimeZone(deviceId);
            } catch (error) {
              if (isError(error)) {
              if (error.name !== 'ServiceError') {
                return handlerInput.responseBuilder
                  .speak('There was a problem connecting to the service.')
                  .getResponse();
              }

              logger.log(
                LogMode.ERROR,
                `TakePillIntent handle() error`,
                error.message,
              );
              }



              /**
               * Fallback to Winnipeg
               */
              userTimeZone = process.env.TZ || 'America/Winnipeg';
            }

            takenDate = zonedTimeToUtc(
              parse(slots.time.value, 'HH:mm', new Date()),
              userTimeZone,
            );
          }
        }

        await handlerInput.context.pillService.takePill(pill, takenDate);

        const speechText = `I've recorded that you've taken ${pill.name}`;

        return handlerInput.responseBuilder
          .speak(speechText)
          .withSimpleCard(config.appName, speechText)
          .withShouldEndSession(true)
          .getResponse();
      }
    }

    const speechText = 'Unknown pill or other eroror';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(config.appName, speechText)
      .withShouldEndSession(true)
      .getResponse();
  },
};
