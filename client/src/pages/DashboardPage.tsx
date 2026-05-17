import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchLeads, deleteLead, exportLeads } from '../api/leads';
import { useDebounce } from '../hooks/useDebounce';
import { useAuthStore } from '../store/authStore';
import type { LeadFilters, Lead } from '../types';
import Filters from '../components/Filters';
import Pagination from '../components/Pagination';
import LeadForm from '../components/LeadForm';
import LeadDetail from '../components/LeadDetail';

const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<LeadFilters>({
    page: 1,
    sort: 'latest',
  });

  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);

  // 🌙 Dark Mode State
  const [darkMode, setDarkMode] = useState(false);

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const debouncedSearch = useDebounce<string>(search, 500);
  const activeFilters = { ...filters, search: debouncedSearch };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['leads', activeFilters],
    queryFn: () => fetchLeads(activeFilters).then((r) => r.data),
  });

  const { mutate: remove } = useMutation({
    mutationFn: deleteLead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['leads'] }),
  });

  const handleExport = async () => {
    const res = await exportLeads(activeFilters);

    const url = URL.createObjectURL(new Blob([res.data]));

    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    a.click();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm px-6 py-3 flex justify-between items-center transition-colors duration-300">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-blue-600">
            GigFlow
          </span>

          <span className="text-gray-400 dark:text-gray-300 text-sm hidden sm:block">
            | Smart Leads Dashboard
          </span>
        </div>

        <div className="flex items-center gap-4">

          <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
            Welcome,{' '}
            <span className="font-medium">
              {user?.name}
            </span>
          </span>

          <span
            className={`px-2 py-0.5 rounded text-xs font-semibold
              ${
                user?.role === 'admin'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
          >
            {user?.role?.toUpperCase()}
          </span>

          {/* 🌙 Dark Mode Toggle */}
          <button
            onClick={toggleDark}
            className="bg-gray-200 dark:bg-gray-700 dark:text-white px-3 py-1.5 rounded text-sm hover:opacity-90 transition"
          >
            {darkMode ? '☀ Light' : '🌙 Dark'}
          </button>

          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">

          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Leads
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage and track your leads
            </p>
          </div>

          <div className="flex gap-3">

            <button
              onClick={handleExport}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition text-sm font-medium"
            >
              Export CSV
            </button>

            <button
              onClick={() => {
                setEditingLead(null);
                setShowForm(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm font-medium"
            >
              + Add Lead
            </button>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white p-2.5 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        />

        {/* Filters */}
        <Filters
          filters={filters}
          onChange={(f) =>
            setFilters({ ...f, page: 1 })
          }
        />

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-16">

            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

            <p className="mt-3 text-gray-500 dark:text-gray-400">
              Loading leads...
            </p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="text-center py-16 text-red-500">

            <p className="text-lg font-medium">
              Failed to load leads.
            </p>

            <p className="text-sm mt-1">
              Make sure the backend server is running.
            </p>
          </div>
        )}

        {/* Empty */}
        {!isLoading &&
          !isError &&
          data?.data?.length === 0 && (
            <div className="text-center py-16 text-gray-400">

              <p className="text-4xl mb-3">
                📋
              </p>

              <p className="text-lg font-medium">
                No leads found.
              </p>

              <p className="text-sm mt-1">
                Try adjusting your filters or add a new lead.
              </p>
            </div>
          )}

        {/* Table */}
        {data?.data && data.data.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mt-4 transition-colors duration-300">

            <table className="w-full border-collapse">

              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 text-left text-sm text-gray-600 dark:text-gray-200">

                  <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-600 font-semibold">
                    Name
                  </th>

                  <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-600 font-semibold">
                    Email
                  </th>

                  <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-600 font-semibold">
                    Status
                  </th>

                  <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-600 font-semibold">
                    Source
                  </th>

                  <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-600 font-semibold">
                    Created
                  </th>

                  <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-600 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.data.map((lead: Lead) => (
                  <tr
                    key={lead._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >

                    <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-800 dark:text-white">

                      <button
                        onClick={() => setViewingLead(lead)}
                        className="hover:text-blue-600 hover:underline text-left"
                      >
                        {lead.name}
                      </button>
                    </td>

                    <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300">
                      {lead.email}
                    </td>

                    <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">

                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${
                            lead.status === 'New'
                              ? 'bg-blue-100 text-blue-700'
                              : ''
                          }
                          ${
                            lead.status === 'Contacted'
                              ? 'bg-yellow-100 text-yellow-700'
                              : ''
                          }
                          ${
                            lead.status === 'Qualified'
                              ? 'bg-green-100 text-green-700'
                              : ''
                          }
                          ${
                            lead.status === 'Lost'
                              ? 'bg-red-100 text-red-700'
                              : ''
                          }
                        `}
                      >
                        {lead.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300">
                      {lead.source}
                    </td>

                    <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">

                      {new Date(
                        lead.createdAt
                      ).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">

                      <div className="flex gap-3">

                        <button
                          onClick={() => setViewingLead(lead)}
                          className="text-gray-500 dark:text-gray-300 hover:text-gray-700 text-sm"
                        >
                          View
                        </button>

                        <button
                          onClick={() => {
                            setEditingLead(lead);
                            setShowForm(true);
                          }}
                          className="text-blue-600 hover:underline text-sm font-medium"
                        >
                          Edit
                        </button>

                        {user?.role === 'admin' && (
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Delete ${lead.name}?`
                                )
                              )
                                remove(lead._id);
                            }}
                            className="text-red-500 hover:underline text-sm font-medium"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data?.meta && (
          <Pagination
            meta={data.meta}
            onPageChange={(p) =>
              setFilters((f) => ({
                ...f,
                page: p,
              }))
            }
          />
        )}
      </div>

      {/* Lead Detail Modal */}
      {viewingLead && (
        <LeadDetail
          lead={viewingLead}
          onClose={() => setViewingLead(null)}
        />
      )}

      {/* Lead Form Modal */}
      {showForm && (
        <LeadForm
          lead={editingLead}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);

            queryClient.invalidateQueries({
              queryKey: ['leads'],
            });
          }}
        />
      )}
    </div>
  );
};

export default DashboardPage;