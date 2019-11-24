
import * as EnvConfig from '../env-config';

export const baseUrl = 'https://' + EnvConfig.env + '.gohelpfund.com/v1/';

export const getAuthorizationToken = baseUrl + 'auth/oauth/token';
export const getCampainsUrl = baseUrl + 'campaigns';
export const getCampainByIdUrl = baseUrl + 'campaigns/{campaignId}';
export const getCategoriesUrl = baseUrl + 'categories';
export const getCategoryByIdUrl = baseUrl + 'categories/{categoryId}';
export const getUploadInfoUrl = baseUrl + 'upload';
export const postCampainsUrl = baseUrl + 'campaigns';
export const postSignUpUrl = baseUrl + 'auth/signup?type=person';
export const postSignInUrl = baseUrl + 'auth/signin';
export const postChangePasswordUrl = baseUrl + 'auth/changePassword';
export const postDonationUrl = baseUrl + 'campaigns/{campaignId}/donate';
export const getFundraiserUrl = baseUrl + 'fundraisers/{fundraiserId}';
export const getEventDataUrl = baseUrl + 'events/{eventId}';
export const postEventDonateUrl = baseUrl + 'events/{eventId}/donate';
export const postAddDonationUrl = baseUrl + 'events/{eventId}/auctionDonate';

export const getLocationUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=';
export const getBtcRateUrl = 'https://blockchain.info/ticker';




