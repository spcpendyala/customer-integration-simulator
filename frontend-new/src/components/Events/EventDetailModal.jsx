import { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { STATUS_COLORS } from '../../utils/constants';
import { formatTimestamp, formatDuration } from '../../utils/formatters';

const EventDetailModal = ({ event, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await apiClient.get(`/events/${event.event_id}/logs`);
        setLogs(data);
      } catch (e) {
        console.error('Failed to fetch logs:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [event.event_id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-semibold">Event Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Event ID</p>
              <p className="font-mono text-xs">{event.event_id}</p>
            </div>
            <div>
              <p className="text-gray-500">Status</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[event.status]}`}>
                {event.status}
              </span>
            </div>
            <div>
              <p className="text-gray-500">Integration</p>
              <p className="capitalize">{event.integration_type}</p>
            </div>
            <div>
              <p className="text-gray-500">Event Type</p>
              <p>{event.event_type}</p>
            </div>
            <div>
              <p className="text-gray-500">Retries</p>
              <p>{event.retry_count} / {event.max_retries}</p>
            </div>
            <div>
              <p className="text-gray-500">Duration</p>
              <p>{formatDuration(event.processing_duration_ms)}</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">State Transitions</h3>
            {loading ? (
              <p className="text-gray-500 text-sm">Loading logs...</p>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div key={log.log_id} className="flex gap-3 text-sm border-l-2 border-gray-200 pl-3">
                    <span className={`font-medium ${log.level === 'error' ? 'text-red-600' : log.level === 'warning' ? 'text-orange-600' : 'text-green-600'}`}>
                      {log.level.toUpperCase()}
                    </span>
                    <span className="text-gray-700 flex-1">{log.message}</span>
                    <span className="text-gray-400 text-xs">{formatTimestamp(log.timestamp)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
