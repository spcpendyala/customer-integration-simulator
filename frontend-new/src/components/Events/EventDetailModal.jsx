import { useState, useEffect } from 'react';
import { ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';
import apiClient from '../../api/client';
import { STATUS_COLORS } from '../../utils/constants';
import { formatTimestamp, formatDuration } from '../../utils/formatters';
import AIDebugger from '../AIDebugger/AIDebugger';

const EventDetailModal = ({ event, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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

  const handleCopy = () => {
    const text = JSON.stringify({
      event_id: event.event_id,
      integration_type: event.integration_type,
      event_type: event.event_type,
      status: event.status,
      retry_count: event.retry_count,
      max_retries: event.max_retries,
      failure_type: event.failure_type,
      failure_reason: event.failure_reason,
      processing_duration_ms: event.processing_duration_ms,
      created_at: event.created_at,
      updated_at: event.updated_at,
      logs: logs,
    }, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto'>
        <div className='flex justify-between items-center p-6 border-b'>
          <h2 className='text-lg font-semibold'>Event Details</h2>
          <div className='flex items-center gap-3'>
            <button
              onClick={handleCopy}
              className='flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600'
              title='Copy event details'
            >
              {copied
                ? <><CheckIcon className='h-4 w-4 text-green-600' /><span className='text-green-600'>Copied!</span></>
                : <><ClipboardDocumentIcon className='h-4 w-4' /><span>Copy</span></>
              }
            </button>
            <button onClick={onClose} className='text-gray-400 hover:text-gray-600 text-2xl'>&times;</button>
          </div>
        </div>

        <div className='p-6 space-y-4'>
          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div>
              <p className='text-gray-500'>Event ID</p>
              <p className='font-mono text-xs'>{event.event_id}</p>
            </div>
            <div>
              <p className='text-gray-500'>Status</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[event.status]}`}>
                {event.status}
              </span>
            </div>
            <div>
              <p className='text-gray-500'>Integration</p>
              <p className='capitalize'>{event.integration_type}</p>
            </div>
            <div>
              <p className='text-gray-500'>Event Type</p>
              <p>{event.event_type}</p>
            </div>
            <div>
              <p className='text-gray-500'>Retries</p>
              <p>{event.retry_count} / {event.max_retries}</p>
            </div>
            <div>
              <p className='text-gray-500'>Duration</p>
              <p>{formatDuration(event.processing_duration_ms)}</p>
            </div>
          </div>

          <div>
            <h3 className='font-medium mb-2'>State Transitions</h3>
            {loading ? (
              <p className='text-gray-500 text-sm'>Loading logs...</p>
            ) : (
              <div className='space-y-2'>
                {logs.map((log) => (
                  <div key={log.log_id} className='flex gap-3 text-sm border-l-2 border-gray-200 pl-3'>
                    <span className={`font-medium ${
                      log.level === 'error' ? 'text-red-600' :
                      log.level === 'warning' ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {log.level.toUpperCase()}
                    </span>
                    <span className='text-gray-700 flex-1'>{log.message}</span>
                    <span className='text-gray-400 text-xs'>{formatTimestamp(log.timestamp)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <AIDebugger event={event} />
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
