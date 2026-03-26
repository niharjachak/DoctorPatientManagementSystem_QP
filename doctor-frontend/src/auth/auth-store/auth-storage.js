const AUTH_STORAGE_KEY = "auth_session";

function normalizeStoredSession(session) {
  if (!session || typeof session !== "object") {
    return null;
  }

  if (!session.token || !session.role) {
    return null;
  }

  return {
    token: session.token,
    role: session.role,
    mustChangePassword: Boolean(session.mustChangePassword),
    user:
      session.user && typeof session.user === "object"
        ? session.user
        : null,
  };
}

export function getStoredAuthSession() {
  try {
    const rawSession = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!rawSession) {
      return null;
    }

    return normalizeStoredSession(JSON.parse(rawSession));
  } catch {
    return null;
  }
}

export function setStoredAuthSession(session) {
  const normalizedSession = normalizeStoredSession(session);

  if (!normalizedSession) {
    clearStoredAuthSession();
    return;
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(normalizedSession));
}

export function clearStoredAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export { AUTH_STORAGE_KEY };

