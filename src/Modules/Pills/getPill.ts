// src/Modules/Pills/getPills.ts
import { Slot } from 'ask-sdk-model';

export const getStaticAndDynamicSlotValuesFromSlot = function (
  slot: Slot,
): { dynamic: { resolvedValues: { value: { id: string; name: string } }[] } } {
  const result = {
    name: slot.name,
    value: slot.value,
  };

  if (((slot.resolutions || {}).resolutionsPerAuthority || [])[0] || {}) {
    slot.resolutions.resolutionsPerAuthority.forEach((authority) => {
      const slotValue = {
        authority: authority.authority,
        statusCode: authority.status.code,
        synonym: slot.value || undefined,
        resolvedValues: slot.value,
      };
      if (authority.values && authority.values.length > 0) {
        slotValue.resolvedValues = [];

        authority.values.forEach((value) => {
          slotValue.resolvedValues.push(value);
        });
      }

      if (authority.authority.includes('amzn1.er-authority.echo-sdk.dynamic')) {
        result.dynamic = slotValue;
      } else {
        result.static = slotValue;
      }
    });
  }
  return result;
};

export function getPillIdFromSlot(slot: Slot): string {
  const pillValue = getStaticAndDynamicSlotValuesFromSlot(
    slot,
  ).dynamic.resolvedValues.find(
    ({ value: { id } }) => typeof id !== 'undefined',
  );

  if (!pillValue) {
    throw new Error('Invalid Pill');
  }

  return pillValue.value.id;
}
