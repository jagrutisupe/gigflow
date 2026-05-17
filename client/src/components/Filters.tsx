import type { LeadFilters } from '../types';

interface Props {
  filters: LeadFilters;
  onChange: (f: LeadFilters) => void;
}

const Filters = ({ filters, onChange }: Props) => (
  <div className="flex flex-wrap gap-3 mb-4">
    <select value={filters.status || ''} onChange={(e) => onChange({ ...filters, status: e.target.value || undefined })}
      className="border p-2 rounded">
      <option value="">All Statuses</option>
      {['New','Contacted','Qualified','Lost'].map(s => <option key={s}>{s}</option>)}
    </select>

    <select value={filters.source || ''} onChange={(e) => onChange({ ...filters, source: e.target.value || undefined })}
      className="border p-2 rounded">
      <option value="">All Sources</option>
      {['Website','Instagram','Referral'].map(s => <option key={s}>{s}</option>)}
    </select>

    <select value={filters.sort || 'latest'} onChange={(e) => onChange({ ...filters, sort: e.target.value as 'latest' | 'oldest' })}
      className="border p-2 rounded">
      <option value="latest">Latest</option>
      <option value="oldest">Oldest</option>
    </select>
  </div>
);

export default Filters;