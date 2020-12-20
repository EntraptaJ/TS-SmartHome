// src/Library/Config.ts
export interface Config {
  /**
   * Database connection config
   */
  database: {
    /**
     * Database Hostname
     *
     * Default: `Database`
     */
    hostname: string;

    /**
     * Database Port
     *
     * Default: `5432`
     */
    port: number;

    /**
     * Database/table
     *
     * Default: `SSH-Proxy`
     */
    database: string;

    /**
     * Database Username
     *
     * Default: `postgres`
     */
    username: string;

    /**
     * Password for the database user
     *
     * Default: `pgpass`
     */
    password: string;
  };

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
  database: {
    hostname: process.env.DB_HOST || 'Database',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_DATABASE || 'ts-smarthome',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'pgpass',
  },

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
