import os
import logging
import json
import urllib.request
import urllib.error

logger = logging.getLogger(__name__)


class AIService:
    def __init__(self):
        self.api_key = os.getenv('GEMINI_API_KEY')
        self.debug_mode = os.getenv('ENVIRONMENT') == 'development'
        if not self.api_key:
            logger.warning('GEMINI_API_KEY not set — AI disabled')

    async def analyze_failure(self, event_type, integration_type,
                               failure_type, failure_reason, logs, retry_count):
        if self.debug_mode or not self.api_key:
            return {
                'root_cause': '[DEBUG] Simulated timeout — network unreachable to integration endpoint.',
                'immediate_fix': '- Check network connectivity\n- Increase timeout threshold\n- Verify endpoint URL is correct',
                'prevention': '- Add circuit breaker pattern\n- Monitor latency metrics\n- Set up alerting on failure rate',
                'code_example': 'timeout_ms = 10000  # Increase from default 5000\nmax_retries = 5     # Increase retry attempts'
            }

        prompt = self._build_prompt(event_type, integration_type,
                                     failure_type, failure_reason, logs, retry_count)
        try:
            url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={self.api_key}'
            body = json.dumps({
                'contents': [{'parts': [{'text': prompt}]}]
            }).encode('utf-8')

            req = urllib.request.Request(
                url, data=body,
                headers={'Content-Type': 'application/json'},
                method='POST'
            )
            with urllib.request.urlopen(req) as response:
                data = json.loads(response.read().decode('utf-8'))
                text = data['candidates'][0]['content']['parts'][0]['text']
                return self._parse(text)
        except Exception as e:
            logger.error(f'Gemini API error: {e}')
            return {
                'root_cause': f'AI analysis failed: {str(e)}',
                'immediate_fix': 'Check API key and network connectivity',
                'prevention': 'Monitor API availability',
                'code_example': ''
            }

    def _build_prompt(self, event_type, integration, failure_type,
                      reason, logs, retries):
        return f'''You are an expert integration engineer analyzing a webhook failure.

Event: {integration}.{event_type}
Failure: {failure_type} — {reason}
Retries: {retries}
Logs:
{logs}

Respond with EXACTLY these section headers:

## Root Cause
[2-3 sentences explaining why this failed]

## Immediate Fix
- [specific action to take]

## Prevention Strategy
- [strategy to prevent recurrence]

## Code Example
````python
[relevant code example]
```'''

    def _parse(self, text):
        sections = {
            'root_cause': '',
            'immediate_fix': '',
            'prevention': '',
            'code_example': ''
        }
        current = None
        for line in text.split('\n'):
            if '## Root Cause' in line: current = 'root_cause'
            elif '## Immediate Fix' in line: current = 'immediate_fix'
            elif '## Prevention Strategy' in line: current = 'prevention'
            elif '## Code Example' in line: current = 'code_example'
            elif current and line.strip():
                sections[current] += line + '\n'
        return {k: v.strip() for k, v in sections.items()}


ai_service = AIService()
