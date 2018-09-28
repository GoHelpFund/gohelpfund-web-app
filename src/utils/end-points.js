
import * as EnvConfig from '../env-config';

export const baseUrl = 'http://' + EnvConfig.env + '.gohelpfund.com/v1/';


export const getCampainsUrl = baseUrl + 'campaigns';
export const getCategoriesUrl = baseUrl + 'categories';
export const getUploadInfoUrl = baseUrl + 'upload';
export const postCampainsUrl = baseUrl + 'campaigns';
export const getLocationUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=';



