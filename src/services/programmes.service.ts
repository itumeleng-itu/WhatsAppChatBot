import { Programme } from '../types/programmes.types';

const EXTERNAL_API =
  'https://mlab-knowledge-api.vercel.app/api/programmes';

export const fetchProgrammes = async (): Promise<Programme[]> => {
  const response = await fetch(EXTERNAL_API);

  if (!response.ok) {
    throw new Error('Failed to fetch programmes');
  }

  return response.json();
};
