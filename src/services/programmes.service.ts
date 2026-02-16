import { Programme } from '../types/programmes.types';

const EXTERNAL_API =process.env.CODETRIBE_PROGRAMMES_API!;

export const fetchProgrammes = async (): Promise<Programme[]> => {
  const response = await fetch(EXTERNAL_API);

  if (!response.ok) {
    throw new Error('Failed to fetch programmes');
  }

  return response.json();
};
