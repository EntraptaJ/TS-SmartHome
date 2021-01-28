// src/Modules/Launch/LaunchIntent.ts
import { RequestHandler } from 'ask-sdk-core';
import { Directive } from 'ask-sdk-model';
import { IsType } from '../../../Utils/Helpers';
import { RequestTypes } from '../../../Utils/RequestTypes';
import { logger, LogMode } from '../../../Library/Logger';
import { HandlerInput } from '../../../Library/Alexa/RequestInput';

export const LaunchIntent: RequestHandler = {
  canHandle(handlerInput: HandlerInput) {
    return IsType(handlerInput, RequestTypes.Launch);
  },
  async handle(handlerInput: HandlerInput) {
    logger.log(
      LogMode.DEBUG,
      `LaunchIntent handle() handlerInput: `,
      handlerInput,
    );

    const pills = await handlerInput.context.pillService.find();

    const speechText = `Welcome to TypeScript SmartHome`;

    const replaceEntityDirective: Directive = {
      type: 'Dialog.UpdateDynamicEntities',
      updateBehavior: 'REPLACE',
      types: [
        {
          name: 'Pills',
          values: [
            ...pills.map(({ name, id }) => ({
              id,
              name: {
                value: name,
                synonyms: [name],
              },
            })),
          ],
        },
      ],
    };

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .addDirective(replaceEntityDirective)
      .getResponse();
  },
};
