import { fetchEligibility } from "../services/eligibility.service";
import { parseEligibilityQuery } from "../utils/parseEligibilityQuery";
import { Request, Response } from 'express';

export const getEligibility = async (req: Request, res: Response) => {
    try {
        const { programmeId } = req.params as { programmeId: string };
        const query = parseEligibilityQuery(req.query as Record<string, string>);

        const result = await fetchEligibility(programmeId, query);

        return res.status(200).json(result);

    } catch (error) {
        console.error('[getEligibility] Error:', error);

        if (error instanceof Error) {
            return res.status(500).json({
                message: 'Failed to fetch eligibility data',
                error: error.message,
            });
        }

        return res.status(500).json({ message: 'An unexpected error occurred' });
    }
};