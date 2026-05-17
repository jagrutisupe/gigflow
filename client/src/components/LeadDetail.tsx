import type { Lead } from '../types';

interface Props {
  lead: Lead;
  onClose: () => void;
}

const LeadDetail = ({ lead, onClose }: Props) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Lead Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-500 text-sm">Name</span>
            <span className="font-medium text-gray-800">{lead.name}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-500 text-sm">Email</span>
            <span className="font-medium text-gray-800">{lead.email}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-500 text-sm">Status</span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold
              ${lead.status === 'New' ? 'bg-blue-100 text-blue-700' : ''}
              ${lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-700' : ''}
              ${lead.status === 'Qualified' ? 'bg-green-100 text-green-700' : ''}
              ${lead.status === 'Lost' ? 'bg-red-100 text-red-700' : ''}
            `}>{lead.status}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-500 text-sm">Source</span>
            <span className="font-medium text-gray-800">{lead.source}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-500 text-sm">Created At</span>
            <span className="font-medium text-gray-800">
              {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default LeadDetail;