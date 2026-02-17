import { faqQuery } from '../types/faq.types';

const EXTERNAL_API =process.env.CODETRIBE_PROGRAMMES_API!;

export const fetchfaq = async (): Promise<faqQuery[]> => {
  const response = await fetch(EXTERNAL_API);

  if (!response.ok) {
    throw new Error('Failed to fetch FAQ');
  }

  return response.json();
};
