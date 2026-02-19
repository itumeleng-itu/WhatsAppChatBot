// ─── Query Types ──────────────────────────────────────────────────────────────

export interface ProgrammeQuery {
    limit?: number;
    offset?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    category?: string;
}
