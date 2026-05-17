import type { PaginationMeta } from '../types';

interface Props {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

const Pagination = ({ meta, onPageChange }: Props) => (
  <div className="flex justify-between items-center mt-4 text-sm">
    <p>Showing {((meta.page - 1) * meta.limit) + 1}–{Math.min(meta.page * meta.limit, meta.total)} of {meta.total}</p>
    <div className="flex gap-2">
      <button disabled={meta.page === 1}
        onClick={() => onPageChange(meta.page - 1)}
        className="px-3 py-1 border rounded disabled:opacity-40">Prev</button>
      <span className="px-3 py-1">{meta.page} / {meta.totalPages}</span>
      <button disabled={meta.page === meta.totalPages}
        onClick={() => onPageChange(meta.page + 1)}
        className="px-3 py-1 border rounded disabled:opacity-40">Next</button>
    </div>
  </div>
);

export default Pagination;