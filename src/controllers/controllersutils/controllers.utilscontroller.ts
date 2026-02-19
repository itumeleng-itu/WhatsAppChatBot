// ─────────────────────────────────────────────
//  Shared controller utilities
//  Used by all resource-specific controllers
// ─────────────────────────────────────────────

import { Request, Response } from 'express';

/** Handles caught errors consistently across all controllers. */
export function handleControllerError(res: Response, error: unknown, resource: string): void {
  console.error(`[${resource}Controller]`, error);

  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: `Failed to fetch ${resource}` });
  }
}

/** Extract req.query as RawParams. */
export function extractQuery(req: Request): Record<string, string | string[] | undefined> {
  return req.query as Record<string, string | string[] | undefined>;
}

/** Safely extract a single path param from req.params as a plain string. */
export function extractParam(req: Request, key: string): string | undefined {
  const value = req.params[key];
  if (Array.isArray(value)) return value[0];
  return value;
}