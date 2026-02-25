import os
from anthropic import Anthropic
import logging

logger = logging.getLogger(__name__)


class AIService:
    def __init__(self):
        api_key = os.getenv('ANTHROPIC_API_KEY')
        self.debug_mode = os.getenv('ENVIRONMENT') == 'development'
        self.client = Anthropic(api_key=api_key) if api_key and not self.debug_mode else None
        if not api_key:
            logger.warning('ANTHROPIC_API_KEY not set — AI disabled')

    async def analyze_failure(self, event_type, integration_type,
                               failure_type, failure_reason, logs, retry_count):
        if self.debug_mode or not self.client:
            return {
                'root_cause': '[DEBUG] Simulated timeout — network unreachable to integration endpoint.',
                'immediate_fix': '- Check network connectivity\n- Increase timeout threshold\n- Verify endpoint URL is correct',
                'prevention': '- Add circuit breaker pattern\n- Monitor latency metrics\n- Set up alerting on failure rate',
                'code_example': 'timeout_ms = 10000  # Increase from default 5000\nmax_retries = 5     # Increase retry attempts'
            }

        prompt = f'''You are an expert integration engineer analyzing a webhook failure.

Event: {integration_type}.{event_type}
Failure: {failure_type} — {failure_reason}
Retries: {retry_count}
Logs:
{logs}

Respond with EXACTLY these section headers:

## Root Cause
[2-3 sentences]

## Immediate Fix
- [action]

## Prevention Strategy
- [strategy]

## Code Example
````python
[code if applicable]
```'''

        response = self.client.messages.create(
            model='claude-sonnet-4-20250514',
            max_tokens=1500,
            messages=[{'role': 'user', 'content': prompt}]
        )
        return self._parse(response.content[0].text)

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
