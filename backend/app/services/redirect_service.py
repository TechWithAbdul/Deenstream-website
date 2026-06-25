import os
import sqlite3
import secrets
import time
from typing import Optional

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'redirects.db'))
_lock = None


def _get_lock():
    global _lock
    if _lock is None:
        import threading
        _lock = threading.Lock()
    return _lock


def _conn():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Create redirects table if missing."""
    lock = _get_lock()
    with lock:
        conn = _conn()
        cur = conn.cursor()
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS redirects (
                slug TEXT PRIMARY KEY,
                target TEXT NOT NULL,
                created_at INTEGER NOT NULL,
                expires_at INTEGER
            )
            """
        )
        conn.commit()
        conn.close()


def _generate_slug():
    # short, URL-safe slug
    return secrets.token_urlsafe(6).replace('_', '').replace('-', '')[:8]


def create_slug(target: str, expires_days: Optional[int] = None) -> str:
    """Create a unique slug for a given target URL or path."""
    init_db()
    lock = _get_lock()
    with lock:
        conn = _conn()
        cur = conn.cursor()
        tries = 0
        while tries < 8:
            slug = _generate_slug()
            created_at = int(time.time())
            expires_at = int(created_at + expires_days * 86400) if expires_days else None
            try:
                cur.execute("INSERT INTO redirects (slug, target, created_at, expires_at) VALUES (?, ?, ?, ?)",
                            (slug, target, created_at, expires_at))
                conn.commit()
                conn.close()
                return slug
            except sqlite3.IntegrityError:
                tries += 1
                continue
        conn.close()
        raise RuntimeError('Unable to generate unique slug')


def get_target(slug: str) -> Optional[str]:
    init_db()
    conn = _conn()
    cur = conn.cursor()
    cur.execute("SELECT target, expires_at FROM redirects WHERE slug = ?", (slug,))
    row = cur.fetchone()
    conn.close()
    if not row:
        return None
    expires = row['expires_at']
    if expires and int(time.time()) > expires:
        return None
    return row['target']
