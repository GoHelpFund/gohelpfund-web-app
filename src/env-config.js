export const local = 'local';
export const dev = 'dev-api';
export const prod = 'api';

export const local_host = 'localhost';
export const remote_host = 'gohelpfund.com';

export const api_version = '/v1/';

// change this to the required environment: local, dev, prod
export const env = dev;

/**
 /* local: localhost/v1/
 /* dev:   dev-api.gohelpfund.com/v1/
 /* prod:  api.gohelpfund.com/v1/
 **/

export const env_authority = env === 'local' ? local_host + api_version : env + '.' + remote_host + api_version;