// src/Library/Wyze.ts
import Wyze from 'wyze-node';
import { config } from './Config';

export const wyze = new Wyze(config.wyze);
