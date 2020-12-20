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
}

export const config: Config = {
  bindHost: process.env.HOST || '0.0.0.0',
  bindPort: process.env.PORT || '8080',

  wyze: {
    username: process.env.WYZE_USERNAME,
    password: process.env.WYZE_PASSWORD,
  },
};
