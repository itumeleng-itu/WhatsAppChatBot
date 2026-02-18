import { ProgrammeResponse } from "../types/schedules.types";

const EXTERNAL_API =process.env.CODETRIBE_PROGRAMMES_API!;

export const fetchProgrammes = async (): Promise<ProgrammeResponse> => {
  const response = await fetch(EXTERNAL_API);

  if (!response.ok) {
    throw new Error('Failed to fetch programmes');
  }

  return response.json();
};
