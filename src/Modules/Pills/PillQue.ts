// src/Modules/Pills/PillQue.ts
import Bull from 'bull';

export const pillQue = new Bull('PillTaker', {
  redis: {
    host: process.env.REDIS_HOST || 'Redis',
  },
});
