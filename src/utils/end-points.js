import * as EnvConfig from '../env-config';

export const ssl_enabled = true;
export const uri_scheme = ssl_enabled ? 'https' : 'http';
export const baseUrl = uri_scheme + ':' + EnvConfig.env_authority;
 
export const getAuthorizationToken = baseUrl + 'auth/oauth/token';
export const getCampainsUrl = baseUrl + 'campaigns';
export const getCampainByIdUrl = baseUrl + 'campaigns/{campaignId}';
export const getCategoriesUrl = baseUrl + 'categories';
export const getCategoryByIdUrl = baseUrl + 'categories/{categoryId}';
export const getUploadInfoUrl = baseUrl + 'upload';
export const postCampainsUrl = baseUrl + 'campaigns';
export const getLocationUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=';
export const postSignUpUrl = baseUrl + 'auth/signup';
export const postSignInUrl = baseUrl + 'auth/oauth/token';
export const postDonationUrl = baseUrl + 'campaigns/{campaignId}/donate';
export const getFundraiserUrl = baseUrl + 'fundraisers/{fundraiserId}';



