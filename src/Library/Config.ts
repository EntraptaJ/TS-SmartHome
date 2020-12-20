// src/Library/Config.ts
export interface Config {
  /**
   * Address to bind to. (Only needed when not running in container)
   *
   * Default: `0.0.0.0`
   */
  bindHost: string;

  /**
   * Port to bind to.
   *
   * Default: `8080`
   */
  bindPort: string;

  smartthings: {
    token: string;
  };

  wyze: {
    /**
     * Wyze Account username
     */
    username: string;

    /**
     * Wyze Account Password
     */
    password: string;
  };

  /**
   * Redis Job Que & Cache Settings
   */
  redis: {
    /**
     * Host of the redis server
     *
     * Default: `Redis`
     */
    host: string;
  };
}

export const config: Config = {
  bindHost: process.env.HOST || '0.0.0.0',
  bindPort: process.env.PORT || '8080',

  wyze: {
    username: process.env.WYZE_USERNAME,
    password: process.env.WYZE_PASSWORD,
  },

  smartthings: {
    token: process.env.ST_TOKEN,
  },

  redis: {
    host: process.env.REDIS_HOST || 'Redis',
  },
};
