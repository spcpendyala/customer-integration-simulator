import { useState } from 'react';
import { sendWebhook } from '../../api/endpoints';
import { INTEGRATION_TYPES, EVENT_TYPES } from '../../utils/constants';
import { generatePayload } from '../../utils/payloads';

const SCENARIOS = [
  {
    id: 'payment_outage',
    label: 'Payment Outage',
    description: 'Simulate a Stripe payment processing outage',
    integration: 'stripe',
    eventType: 'payment.failed',
    count: 10,
  },
  {
    id: 'black_friday',
    label: 'Black Friday Surge',
    description: 'Simulate high volume Shopify orders',
    integration: 'shopify',
    eventType: 'order.created',
    count: 20,
  },
  {
    id: 'subscription_churn',
    label: 'Subscription Churn',
    description: 'Simulate mass subscription cancellations',
    integration: 'stripe',
    eventType: 'subscription.cancelled',
    count: 8,
  },
  {
    id: 'sales_pipeline',
    label: 'Sales Pipeline',
    description: 'Simulate CRM deal activity',
    integration: 'crm',
    eventType: 'deal.won',
    count: 5,
  },
  {
    id: 'dispute_wave',
    label: 'Dispute Wave',
    description: 'Simulate incoming payment disputes',
    integration: 'stripe',
    eventType: 'dispute.created',
    count: 6,
  },
];

const SimulatorControls = ({ onEventCreated }) => {
  const [mode, setMode] = useState('single');
  const [integration, setIntegration] = useState('stripe');
  const [eventType, setEventType] = useState('payment.succeeded');
  const [batchCount, setBatchCount] = useState(5);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(null);

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const handleSingle = async () => {
    setSending(true);
    setResult(null);
    try {
      const payload = generatePayload(integration, eventType);
      const res = await sendWebhook(integration, payload);
      setResult({ success: true, data: res, count: 1 });
      if (onEventCreated) onEventCreated(res);
    } catch (e) {
      setResult({ success: false, error: e.message });
    } finally {
      setSending(false);
    }
  };

  const handleBatch = async () => {
    setSending(true);
    setResult(null);
    let succeeded = 0;
    let failed = 0;

    for (let i = 0; i < batchCount; i++) {
      setProgress(`Sending ${i + 1} of ${batchCount}...`);
      try {
        const payload = generatePayload(integration, eventType);
        const res = await sendWebhook(integration, payload);
        succeeded++;
        if (onEventCreated) onEventCreated(res);
      } catch (e) {
        failed++;
      }
      await sleep(200);
    }

    setProgress(null);
    setResult({ success: true, count: batchCount, succeeded, failed });
    setSending(false);
  };

  const handleScenario = async (scenario) => {
    setSending(true);
    setResult(null);
    let succeeded = 0;
    let failed = 0;

    for (let i = 0; i < scenario.count; i++) {
      setProgress(`${scenario.label}: sending ${i + 1} of ${scenario.count}...`);
      try {
        const payload = generatePayload(scenario.integration, scenario.eventType);
        const res = await sendWebhook(scenario.integration, payload);
        succeeded++;
        if (onEventCreated) onEventCreated(res);
      } catch (e) {
        failed++;
      }
      await sleep(150);
    }

    setProgress(null);
    setResult({ success: true, count: scenario.count, succeeded, failed, scenario: scenario.label });
    setSending(false);
  };

  return (
    <div className='bg-white rounded-lg shadow p-6'>
      <h2 className='text-lg font-semibold mb-4'>Webhook Simulator</h2>

      <div className='flex gap-2 mb-4'>
        {['single', 'batch', 'scenarios'].map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setResult(null); }}
            className={`px-3 py-1.5 rounded text-sm font-medium capitalize ${
              mode === m ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {mode === 'single' && (
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Integration</label>
            <select
              value={integration}
              onChange={e => { setIntegration(e.target.value); setEventType(EVENT_TYPES[e.target.value][0]); }}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              {INTEGRATION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Event Type</label>
            <select
              value={eventType}
              onChange={e => setEventType(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              {(EVENT_TYPES[integration] || []).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <button
            onClick={handleSingle}
            disabled={sending}
            className={`w-full py-3 rounded-lg font-medium text-white ${
              sending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {sending ? 'Sending...' : 'Send Test Webhook'}
          </button>
        </div>
      )}

      {mode === 'batch' && (
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Integration</label>
            <select
              value={integration}
              onChange={e => { setIntegration(e.target.value); setEventType(EVENT_TYPES[e.target.value][0]); }}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              {INTEGRATION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Event Type</label>
            <select
              value={eventType}
              onChange={e => setEventType(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              {(EVENT_TYPES[integration] || []).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Number of Events: <span className='font-bold text-blue-600'>{batchCount}</span>
            </label>
            <input
              type='range'
              min='2'
              max='50'
              value={batchCount}
              onChange={e => setBatchCount(Number(e.target.value))}
              className='w-full'
            />
            <div className='flex justify-between text-xs text-gray-400 mt-1'>
              <span>2</span><span>50</span>
            </div>
          </div>
          <button
            onClick={handleBatch}
            disabled={sending}
            className={`w-full py-3 rounded-lg font-medium text-white ${
              sending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {sending ? progress || 'Sending...' : `Send ${batchCount} Webhooks`}
          </button>
        </div>
      )}

      {mode === 'scenarios' && (
        <div className='space-y-3'>
          <p className='text-sm text-gray-500'>Pre-built scenarios that simulate real-world events</p>
          {SCENARIOS.map(scenario => (
            <div key={scenario.id} className='border border-gray-200 rounded-lg p-4'>
              <div className='flex justify-between items-start'>
                <div>
                  <p className='font-medium text-gray-900'>{scenario.label}</p>
                  <p className='text-xs text-gray-500 mt-1'>{scenario.description}</p>
                  <p className='text-xs text-blue-600 mt-1'>
                    {scenario.integration} · {scenario.eventType} · {scenario.count} events
                  </p>
                </div>
                <button
                  onClick={() => handleScenario(scenario)}
                  disabled={sending}
                  className={`ml-3 px-3 py-1.5 rounded text-sm font-medium text-white flex-shrink-0 ${
                    sending ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {sending && progress?.includes(scenario.label) ? 'Running...' : 'Run'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {progress && (
        <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
          <p className='text-blue-800 text-sm'>{progress}</p>
        </div>
      )}

      {result && !progress && (
        <div className={`mt-4 p-4 rounded-lg border ${
          result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          {result.success ? (
            result.count === 1
              ? <p className='text-green-800 text-sm'>✓ Sent — Event ID: {result.data?.event_id}</p>
              : <p className='text-green-800 text-sm'>
                  ✓ {result.scenario ? `${result.scenario} complete` : 'Batch complete'} —
                  {result.succeeded} sent, {result.failed} failed
                </p>
          ) : (
            <p className='text-red-800 text-sm'>✗ Failed: {result.error}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SimulatorControls;
