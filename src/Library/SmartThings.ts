// src/Library/SmartThings.ts
import { SmartThings } from '@bridgerakol/samsung-smart-api';
import { config } from './Config';

export const smartthings = new SmartThings(config.smartthings.token);
