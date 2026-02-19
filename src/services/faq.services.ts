import { Faq } from '../types/faq.types';
import { EligibilityCriterion } from '../types/eligibility.types';
import { ApplicationStep } from '../types/applicationProcess.types';
import { CurriculumModule } from '../types/curriculum.types';
import { Schedule } from '../types/schedules.types';
import { Policy } from '../types/policies.types';
import { Location as MLabLocation } from '../types/location.types';

const BASE_URL = process.env.CODETRIBE_PROGRAMMES_API;
const PROGRAM_ID = process.env.CODETRIBE_PROGRAM_ID;

// generic fetcher to avoid repeating fetch logic
const fetchFromApi = async <T>(endpoint: string): Promise<T[]> => {
    const response = await fetch(`${BASE_URL}${endpoint}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch ${endpoint}`);
    }

    const json = await response.json();
    return json.data ?? [];  // unwrap the { data: [...] } wrapper
};


export const fetchFaqs = (): Promise<Faq[]> =>
    fetchFromApi<Faq>('/faqs');

export const fetchEligibility = (): Promise<EligibilityCriterion[]> =>
    fetchFromApi<EligibilityCriterion>(`/eligibility/${PROGRAM_ID}`);

export const fetchPolicies = (): Promise<Policy[]> =>
    fetchFromApi<Policy>('/policies')

export const fetchApplicationProcess = (): Promise<ApplicationStep[]> =>
    fetchFromApi<ApplicationStep>(`/application-process/${PROGRAM_ID}`)

export const fetchCurriculum = (): Promise<CurriculumModule[]> =>
    fetchFromApi<CurriculumModule>(`/curriculum/${PROGRAM_ID}`)

export const fetchLocations = (): Promise<MLabLocation[]> =>
    fetchFromApi<MLabLocation>('/locations')

export const fetchSchedule = (): Promise<Schedule[]> =>
    fetchFromApi<Schedule>(`/schedules/${PROGRAM_ID}`)
