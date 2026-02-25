import { useState } from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';
import apiClient from '../../api/client';

const ANALYZABLE_STATUSES = ['failed', 'permanent_failure', 'timed_out', 'retrying'];

const AIDebugger = ({ event }) => {
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  if (!ANALYZABLE_STATUSES.includes(event.status)) return null;

  const analyze = async () => {
    setAnalyzing(true);
    setError(null);
    setAnalysis(null);
    try {
      const { data } = await apiClient.post(`/ai-debug/${event.event_id}`);
      setAnalysis(data.analysis);
    } catch (e) {
      setError(e.response?.data?.detail || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className='mt-6 border-t pt-6'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold flex items-center'>
          <SparklesIcon className='h-5 w-5 mr-2 text-purple-600' />
          AI Debug Assistant
        </h3>
        {!analysis && (
          <button
            onClick={analyze}
            disabled={analyzing}
            className={`px-4 py-2 rounded-lg font-medium text-white ${
              analyzing ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {analyzing ? 'Analyzing...' : 'Analyze Failure'}
          </button>
        )}
      </div>

      {error && (
        <div className='bg-red-50 border border-red-200 rounded p-4 text-red-800 text-sm'>
          {error}
        </div>
      )}

      {analyzing && (
        <div className='flex justify-center py-8'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600' />
        </div>
      )}

      {analysis && (
        <div className='space-y-4'>
          <div className='bg-red-50 border border-red-200 rounded p-4'>
            <h4 className='font-semibold text-red-900 mb-2'>Root Cause</h4>
            <p className='text-sm text-red-800 whitespace-pre-wrap'>{analysis.root_cause}</p>
          </div>
          <div className='bg-yellow-50 border border-yellow-200 rounded p-4'>
            <h4 className='font-semibold text-yellow-900 mb-2'>Immediate Fix</h4>
            <div className='text-sm text-yellow-800 whitespace-pre-wrap'>{analysis.immediate_fix}</div>
          </div>
          <div className='bg-blue-50 border border-blue-200 rounded p-4'>
            <h4 className='font-semibold text-blue-900 mb-2'>Prevention Strategy</h4>
            <div className='text-sm text-blue-800 whitespace-pre-wrap'>{analysis.prevention}</div>
          </div>
          {analysis.code_example && (
            <div className='bg-gray-50 border border-gray-200 rounded p-4'>
              <h4 className='font-semibold text-gray-900 mb-2'>Code Example</h4>
              <pre className='text-xs overflow-x-auto'><code>{analysis.code_example}</code></pre>
            </div>
          )}
          <button
            onClick={() => setAnalysis(null)}
            className='text-sm text-gray-600 hover:text-gray-900'
          >
            Clear Analysis
          </button>
        </div>
      )}
    </div>
  );
};

export default AIDebugger;
