// src/Utils/isIntent.ts
import { HandlerInput } from 'ask-sdk-core';
import { logger, LogMode } from '../Library/Logger';
import { RequestTypes } from './RequestTypes';

/**
 * Checks if the request matches any of the given intents.
 *
 * @param handlerInput
 * @param intents
 */
export function IsIntent(
  handlerInput: HandlerInput,
  ...intents: string[]
): boolean {
  if (handlerInput.requestEnvelope.request.type === RequestTypes.Intent) {
    for (let i = 0; i < intents.length; i++) {
      if (
        'intent' in handlerInput.requestEnvelope.request &&
        handlerInput.requestEnvelope.request.intent.name === intents[i]
      ) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Checks if the request matches any of the given types.
 *
 * @param handlerInput
 * @param types
 */
export function IsType(
  handlerInput: HandlerInput,
  ...types: string[]
): boolean {
  logger.log(LogMode.DEBUG, `isType(`, handlerInput, `,`, types, `)`)

  for (const type of types) {
    if (handlerInput.requestEnvelope.request.type === type) {
      return true;
    }
  }

  return false;
}

export function isError(error: any): error is Error {
  if ('name' in error) {
    return true;
  }

  return false;
}