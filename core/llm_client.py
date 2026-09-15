"""
PlacementCopilot AI — LLM Client
Multi-provider AI client supporting Groq LPUs, Gemini, and robust offline intelligent heuristics.
"""

import json
import urllib.request
import urllib.error
import os

DEFAULT_MODEL = "openai/gpt-oss-120b"

class LLMClient:
    def __init__(self, api_key=None, provider="groq", model=None):
        self.api_key = api_key or os.getenv("GROQ_API_KEY", "")
        self.provider = provider
        self.model = model or DEFAULT_MODEL

    def generate_completion(self, system_prompt, user_prompt, temperature=0.7, max_tokens=1024):
        """
        Attempts to call the cloud LLM.
        If network fails or is offline, returns None so callers use local heuristic intelligence.
        """
        if not self.api_key:
            return None

        url = "https://api.groq.com/openai/v1/chat/completions"
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": temperature,
            "max_tokens": max_tokens
        }

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "User-Agent": "PlacementCopilot/1.0"
        }

        try:
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers=headers,
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=8) as resp:
                if resp.status == 200:
                    data = json.loads(resp.read().decode("utf-8"))
                    return data["choices"][0]["message"]["content"]
        except Exception:
            # Fallback to local heuristic engine smoothly
            return None

        return None
