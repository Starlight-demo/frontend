import { protectedAxiosInstance } from '../api';

export const getOneSponsor = async (sponsorId) => {
  return await protectedAxiosInstance.get(`sponsors/${sponsorId}`).then((response) => response.data);
};

export const patchSponsor = async (sponsorId, sponsor) => {
  return await protectedAxiosInstance.patch(`sponsors/${sponsorId}`, sponsor).then((response) => response.data);
};
