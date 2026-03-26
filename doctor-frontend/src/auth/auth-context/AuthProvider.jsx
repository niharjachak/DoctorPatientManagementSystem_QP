import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login as loginRequest, logout as logoutRequest } from "../../api/modules/auth.api";
import {
  clearApiClientAuthHandlers,
  setApiClientAuthHandlers,
} from "../../api/client/http-client";
import {
  clearStoredAuthSession,
  getStoredAuthSession,
  setStoredAuthSession,
} from "../auth-store/auth-storage";
import { getDefaultRouteForSession } from "../../routes/redirect-by-role";
import { ROUTE_PATHS } from "../../routes/route-paths";

export const AuthContext = createContext(null);

const initialAuthState = {
  user: null,
  token: null,
  role: null,
  mustChangePassword: false,
  isAuthenticated: false,
  isBootstrapped: false,
};

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [authState, setAuthState] = useState(initialAuthState);

  const applySession = useCallback((session) => {
    if (!session?.token || !session?.role) {
      setAuthState((currentState) => ({
        ...currentState,
        user: null,
        token: null,
        role: null,
        mustChangePassword: false,
        isAuthenticated: false,
      }));
      return;
    }

    setAuthState((currentState) => ({
      ...currentState,
      user: session.user ?? null,
      token: session.token,
      role: session.role,
      mustChangePassword: Boolean(session.mustChangePassword),
      isAuthenticated: true,
    }));
  }, []);

  const clearSession = useCallback(() => {
    clearStoredAuthSession();
    setAuthState((currentState) => ({
      ...currentState,
      user: null,
      token: null,
      role: null,
      mustChangePassword: false,
      isAuthenticated: false,
    }));
  }, []);

  useEffect(() => {
    const storedSession = getStoredAuthSession();

    if (storedSession) {
      applySession(storedSession);
    }

    setAuthState((currentState) => ({
      ...currentState,
      isBootstrapped: true,
    }));
  }, [applySession]);

  const finalizeLogout = useCallback(
    (redirectPath = ROUTE_PATHS.home, navigationState) => {
      if (location.pathname !== redirectPath) {
        navigate(redirectPath, { replace: true, state: navigationState });
      }

      clearSession();
    },
    [clearSession, location.pathname, navigate],
  );

  const logout = useCallback(async (options = {}) => {
    const {
      redirectPath = ROUTE_PATHS.home,
      state: navigationState,
    } = options;
    const activeToken = authState.token || getStoredAuthSession()?.token;

    try {
      if (activeToken) {
        await logoutRequest();
      }
    } catch {
      // The backend may reject logout for expired or already invalidated tokens.
    } finally {
      finalizeLogout(redirectPath, navigationState);
    }
  }, [authState.token, finalizeLogout]);

  const setMustChangePassword = useCallback((value) => {
    setAuthState((currentState) => {
      const nextState = {
        ...currentState,
        mustChangePassword: Boolean(value),
      };

      if (nextState.token && nextState.role) {
        setStoredAuthSession({
          token: nextState.token,
          role: nextState.role,
          mustChangePassword: nextState.mustChangePassword,
          user: nextState.user,
        });
      }

      return nextState;
    });
  }, []);

  const login = useCallback(
    async (payload) => {
      const response = await loginRequest(payload);
      const session = {
        token: response.data.token,
        role: response.data.role,
        mustChangePassword: response.data.mustChangePassword,
        user: {
          name: response.data.name,
          email: payload.email,
        },
      };

      setStoredAuthSession(session);
      applySession(session);

      navigate(getDefaultRouteForSession(session), { replace: true });

      return response;
    },
    [applySession, navigate],
  );

  useEffect(() => {
    setApiClientAuthHandlers({
      getToken: () => getStoredAuthSession()?.token ?? null,
      onUnauthorized: async () => {
        finalizeLogout();
      },
      onForbidden: async () => {
        const activeSession = getStoredAuthSession();

        if (
          activeSession?.role === "DOCTOR" &&
          activeSession.mustChangePassword &&
          location.pathname !== ROUTE_PATHS.doctor.changePassword
        ) {
          navigate(ROUTE_PATHS.doctor.changePassword, { replace: true });
        }
      },
    });

    return () => {
      clearApiClientAuthHandlers();
    };
  }, [finalizeLogout, location.pathname, navigate]);

  const contextValue = useMemo(
    () => ({
      user: authState.user,
      token: authState.token,
      role: authState.role,
      mustChangePassword: authState.mustChangePassword,
      isAuthenticated: authState.isAuthenticated,
      isBootstrapped: authState.isBootstrapped,
      login,
      logout,
      setMustChangePassword,
    }),
    [
      authState.isAuthenticated,
      authState.isBootstrapped,
      authState.mustChangePassword,
      authState.role,
      authState.token,
      authState.user,
      login,
      logout,
      setMustChangePassword,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
