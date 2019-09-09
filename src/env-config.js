
export const prod = 'api';
export const dev = 'dev-api';


const hostname = window && window.location && window.location.hostname;
const docker_env = window && window.ENV && window.ENV.REACT_APP_ENV;
let backendHost;

if(hostname === 'beta.gohelpfund.com' && docker_env === 'prod') {
    backendHost = prod;
} else if(hostname === 'dev-beta.gohelpfund.com' && docker_env === 'dev') {
    backendHost = dev;
} else {
    backendHost = dev;
}

export const env = backendHost;
