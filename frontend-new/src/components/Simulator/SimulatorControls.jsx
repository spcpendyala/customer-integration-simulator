import { useState } from 'react';
import { sendWebhook } from '../../api/endpoints';
import { INTEGRATION_TYPES, EVENT_TYPES } from '../../utils/constants';

const SimulatorControls = ({ onEventCreated }) => {
  const [integration, setIntegration] = useState('stripe');
  const [eventType, setEventType] = useState('payment.succeeded');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  const handleSend = async () => {
    setSending(true);
    setResult(null);
    try {
      const payload = {
        event_type: eventType,
        data: { amount: Math.floor(Math.random() * 10000) + 100 },
        idempotency_key: `${integration}_${Date.now()}`,
      };
      const res = await sendWebhook(integration, payload);
      setResult({ success: true, data: res });
      if (onEventCreated) onEventCreated(res);
    } catch (e) {
      setResult({ success: false, error: e.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className='bg-white rounded-lg shadow p-6'>
      <h2 className='text-lg font-semibold mb-4'>Webhook Simulator</h2>
      <div className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Integration</label>
          <select
            value={integration}
            onChange={e => {
              setIntegration(e.target.value);
              setEventType(EVENT_TYPES[e.target.value][0]);
            }}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            {INTEGRATION_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Event Type</label>
          <select
            value={eventType}
            onChange={e => setEventType(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            {(EVENT_TYPES[integration] || []).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSend}
          disabled={sending}
          className={`w-full py-3 rounded-lg font-medium text-white transition-colors ${
            sending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {sending ? 'Sending...' : 'Send Test Webhook'}
        </button>

        {result && (
          <div className={`p-4 rounded-lg border ${
            result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            {result.success
              ? <p className='text-green-800 text-sm'>✓ Sent — Event ID: {result.data?.event_id}</p>
              : <p className='text-red-800 text-sm'>✗ Failed: {result.error}</p>
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulatorControls;
