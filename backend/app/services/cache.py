"""Simple in-memory TTL cache for lightweight response caching."""
import time
from typing import Any

class TTLCache:
    def __init__(self):
        self.store = {}

    def set(self, key: str, value: Any, ttl: int = 300):
        self.store[key] = (value, time.time() + ttl)

    def get(self, key: str):
        v = self.store.get(key)
        if not v:
            return None
        value, exp = v
        if time.time() > exp:
            del self.store[key]
            return None
        return value

    def clear(self):
        self.store = {}

cache = TTLCache()
