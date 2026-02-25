import { useState } from 'react';
import { useEvents } from '../../hooks/useEvents';
import { STATUS_COLORS } from '../../utils/constants';
import { formatRelativeTime, truncateId } from '../../utils/formatters';
import EventDetailModal from './EventDetailModal';

const EventList = () => {
  const { events, loading, error } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState(null);

  if (loading) return <div className="text-gray-500 p-4">Loading events...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3">Events ({events.length})</h2>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Integration</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr
                key={event.event_id}
                onClick={() => setSelectedEvent(event)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-4 py-3 text-sm font-mono text-gray-600">
                  {truncateId(event.event_id)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 capitalize">
                  {event.integration_type}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {event.event_type}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[event.status] || 'bg-gray-100 text-gray-800'}`}>
                    {event.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {formatRelativeTime(event.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
