import { protectedAxiosInstance } from '../api';

export const getKudos = async (proofId) => {
  return await protectedAxiosInstance.get(`proofs/${proofId}/kudos`).then((response) => response.data);
};

export const postKudos = async (proofId, kudos) => {
  return await protectedAxiosInstance.post(`proofs/${proofId}/kudos?kudos=${kudos}`).then((response) => response.data);
};
