export type EvidenceStatus = 'confirmed' | 'reported' | 'needs_review';
export type Comparability = 'same_protocol' | 'qualified' | 'different_protocol' | 'unknown';
export interface EditorialCard {
  id?: string;
  title: string;
  badge: { kind: 'peer_reviewed' | 'preprint' | 'historical_event' | 'benchmark_suite' | 'official_report' | 'vendor_report' | 'unverified'; year: number | null };
  tags: Array<string | null>;
  finding: { headline: string; explanation: string; value?: number | null; unit?: string | null; kind: 'quantitative' | 'comparison' | 'historical_event' | 'not_reported' };
  setup: string;
  limitations: string;
  teaser: string;
  timeline_year: number | null;
  evidence_date: string | null;
  date_basis: string;
  timeline_note: string;
  sources: Array<{ title: string; label?: string; url: string | null; journal_citation: string | null; locator?: string | null }>;
  validation: { status: EvidenceStatus; scoreStatus?: EvidenceStatus; note: string; comparability?: Comparability; reviewedAt?: string | null; reviewedBy?: string | null };
}
