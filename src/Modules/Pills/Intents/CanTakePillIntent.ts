// src/Modules/Pills/CanTakePillIntent.ts
import { CustomSkillRequestHandler } from 'ask-sdk-core/dist/dispatcher/request/handler/CustomSkillRequestHandler';
import { isPast } from 'date-fns';
import { HandlerInput } from '../../../Library/Alexa/RequestInput';
import { config } from '../../../Library/Config';
import { IsIntent } from '../../../Utils/Helpers';
import { IntentTypes } from '../../../Utils/IntentTypes';
import { getPillIdFromSlot } from '../getPill';

export const CanTakePillIntent: CustomSkillRequestHandler = {
  canHandle(handlerInput: HandlerInput) {
    return IsIntent(handlerInput, IntentTypes.CanTakePill);
  },
  async handle(handlerInput: HandlerInput) {
    if ('intent' in handlerInput.requestEnvelope.request) {
      const { slots } = handlerInput.requestEnvelope.request.intent;

      if (typeof slots?.pill !== 'undefined') {
        const pillId = getPillIdFromSlot(slots.pill);

        const pill = await handlerInput.context.pillService.findOne(pillId);

        const earliestNextDose = await pill.nextEarliestDose();

        let speechText: string;
        if (isPast(earliestNextDose)) {
          speechText = `Yes you can take your next pill`;
        } else {
          speechText = `No you can't take your next pill yet`;
        }

        return handlerInput.responseBuilder
          .speak(speechText)
          .withSimpleCard(config.appName, speechText)
          .withShouldEndSession(true)
          .getResponse();
      }
    }

    const speechText = 'Invalid Pill';
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(config.appName, speechText)
      .withShouldEndSession(true)
      .getResponse();
  },
};
