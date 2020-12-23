// src/Modules/Pills/ListPillsIntent.ts
import { RequestHandler } from 'ask-sdk-core';
import { HandlerInput } from '../../Library/Alexa/RequestInput';
import { logger, LogMode } from '../../Library/Logger';
import { IsIntent } from '../../Utils/Helpers';
import { IntentTypes } from '../../Utils/IntentTypes';

export const ListPillsIntent: RequestHandler = {
  canHandle(handlerInput: HandlerInput) {
    return IsIntent(handlerInput, IntentTypes.ListPills);
  },
  async handle(handlerInput: HandlerInput) {
    logger.log(
      LogMode.DEBUG,
      `ListPillsIntent handle() AttributesLab`,
      handlerInput.attributesManager.getSessionAttributes(),
    );

    logger.log(
      LogMode.DEBUG,
      `ListPillsIntent handle() handlerInput: `,
      handlerInput,
    );

    const pills = await handlerInput.context.pillService.find();

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

    const speechText = `Pills have been updated`;
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .addDirective(replaceEntityDirective)
      .getResponse();
  },
};
