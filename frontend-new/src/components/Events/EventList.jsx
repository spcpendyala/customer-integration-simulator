import { useState } from 'react';
import { useEvents } from '../../hooks/useEvents';
import { STATUS_COLORS } from '../../utils/constants';
import { formatRelativeTime, truncateId } from '../../utils/formatters';
import EventDetailModal from './EventDetailModal';

const PAGE_SIZE = 20;

const FILTER_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'success', label: 'Success' },
  { value: 'permanent_failure', label: 'Permanent Failure' },
  { value: 'retrying', label: 'Retrying' },
  { value: 'failed', label: 'Failed' },
  { value: 'timed_out', label: 'Timed Out' },
];

const EventList = () => {
  const { events, loading, error } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? events
    : events.filter(e => e.status === filter);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (val) => {
    setFilter(val);
    setPage(1);
  };

  if (loading) return <div className='text-gray-500 p-4'>Loading events...</div>;
  if (error) return <div className='text-red-500 p-4'>Error: {error}</div>;

  return (
    <div className='p-4'>
      <div className='flex justify-between items-center mb-3'>
        <h2 className="text-lg font-semibold">Events</h2>
        <select
          value={filter}
          onChange={e => handleFilterChange(e.target.value)}
          className='px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          {FILTER_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className='overflow-x-auto rounded-lg border border-gray-200'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>ID</th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Integration</th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Event Type</th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Status</th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Created</th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {paginated.map((event) => (
              <tr
                key={event.event_id}
                onClick={() => setSelectedEvent(event)}
                className='hover:bg-gray-50 cursor-pointer'
              >
                <td className='px-4 py-3 text-sm font-mono text-gray-600'>
                  {truncateId(event.event_id)}
                </td>
                <td className='px-4 py-3 text-sm text-gray-900 capitalize'>
                  {event.integration_type}
                </td>
                <td className='px-4 py-3 text-sm text-gray-600'>
                  {event.event_type}
                </td>
                <td className='px-4 py-3'>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[event.status] || 'bg-gray-100 text-gray-800'}`}>
                    {event.status}
                  </span>
                </td>
                <td className='px-4 py-3 text-sm text-gray-500'>
                  {formatRelativeTime(event.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className='flex justify-between items-center mt-4'>
          <p className='text-sm text-gray-500'>
            Page {page} of {totalPages} — showing {paginated.length} of {filtered.length} events
          </p>
          <div className='flex gap-2'>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className='px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50'
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-1.5 text-sm border rounded-lg ${
                    page === pageNum
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className='px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50'
            >
              Next
            </button>
          </div>
        </div>
      )}

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default EventList;
