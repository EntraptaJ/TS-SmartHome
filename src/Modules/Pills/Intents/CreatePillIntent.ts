// src/Modules/Pills/GetPillIntent.ts
import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Directive } from 'ask-sdk-model';
import { Container } from 'typedi';
import { logger, LogMode } from '../../../Library/Logger';
import { IsIntent } from '../../../Utils/Helpers';
import { IntentTypes } from '../../../Utils/IntentTypes';
import { PillService } from '../PillService';

export const CreatePillIntent: RequestHandler = {
  canHandle(handlerInput: HandlerInput) {
    return IsIntent(handlerInput, IntentTypes.CreatePill);
  },
  async handle(handlerInput: HandlerInput) {
    if (
      'intent' in handlerInput.requestEnvelope.request &&
      handlerInput.requestEnvelope.request.intent.slots
    ) {
      const { intent } = handlerInput.requestEnvelope.request;

      console.log(intent);

      const speakOutput = 'Are you sure you want to create this new pill?';

      if (intent.slots?.dynamicEntity.confirmationStatus !== 'CONFIRMED') {
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .reprompt(speakOutput)
          .getResponse();
      }

      const pillService = Container.get(PillService);

      const pill = await pillService.createAndSavePill({
        interval: 4,
        minimumInterval: 3.2,
        name: intent.slots?.dynamicEntity.value,
      });

      logger.log(LogMode.INFO, 'Created new pill: ', pill);

      const pills = await pillService.find();

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

      const speech = 'Your pill has been saved. Thank You.';

      return handlerInput.responseBuilder
        .speak(speech)
        .addDirective(replaceEntityDirective)
        .getResponse();
    }

    throw new Error('Unknown issue');
  },
};
