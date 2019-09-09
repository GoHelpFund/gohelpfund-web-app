
export const prod = 'api';
export const dev = 'dev-api';

const hostname = window && window.location && window.location.hostname;
let backendHost;

if(hostname === 'beta.gohelpfund.com') {
    backendHost = prod;
} else if(hostname === 'dev-beta.gohelpfund.com') {
    backendHost = dev;
} else {
    backendHost = dev;
}

export const env = backendHost;
