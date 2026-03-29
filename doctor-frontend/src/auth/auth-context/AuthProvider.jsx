import { useCallback, useEffect, useMemo, useState } from "react"; // hooks for managing state and side effects in the AuthProvider component.
import { useLocation, useNavigate } from "react-router-dom"; // hooks for navigation and accessing the current location in the React Router.
import { login as loginRequest, logout as logoutRequest } from "../../api/modules/auth.api";
// AuthProvider component that manages authentication state and 
// provides login and logout functions to the rest of the application through React Context.
import {
  clearApiClientAuthHandlers,
  setApiClientAuthHandlers,
} from "../../api/client/http-client"; // functions to configure authentication handlers for the API client, 
//                                         allowing it to automatically include authentication tokens in requests and handle unauthorized responses.
import {
  clearStoredAuthSession,
  getStoredAuthSession,               // utility functions for managing the authentication session in local storage, 
  setStoredAuthSession,               // allowing the application to persist the user's authentication state across page reloads and browser session
} from "../auth-store/auth-storage";

import { getDefaultRouteForSession } from "../../routes/redirect-by-role";
import { ROUTE_PATHS } from "../../routes/route-paths";
import { AuthContext } from "./AuthContext";

//initial state for the authentication context, which includes information about the current user, authentication token, role, and flags for whether the user must change their password or if the authentication state has been bootstrapped from storage.
const initialAuthState = {
  user: null,
  token: null,
  role: null,
  mustChangePassword: false,
  isAuthenticated: false,
  isBootstrapped: false,
};

// AuthProvider component that manages authentication state and provides login and 
// logout functions to the rest of the application through React Context.
export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [authState, setAuthState] = useState(initialAuthState);

  // applySession is a function that takes an authentication session object 
  // and updates the authentication state accordingly, setting the user, token, role, 
  // and other relevant information based on the session data.
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

    // updates the authentication state with the information from the session,
    // marking the user as authenticated and storing the token, role, and other relevant details.
    setAuthState((currentState) => ({
      ...currentState,
      user: session.user ?? null,
      token: session.token,
      role: session.role,
      mustChangePassword: Boolean(session.mustChangePassword),
      isAuthenticated: true,
    }));
  }, []);


  // clearSession is a function that clears the authentication session from local storage 
  // and resets the authentication state to its initial values, effectively logging the user out of the application.
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


  // useEffect hook that runs when the component mounts, 
  // attempting to load any existing authentication session 
  // from local storage and applying it to the authentication state.
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

  // finalizeLogout is a function that handles the final steps of logging out a user
  // by navigating to a specified redirect path (defaulting to the home page) 
  // and then clearing the authentication session
  const finalizeLogout = useCallback(
    (redirectPath = ROUTE_PATHS.home, navigationState) => {
      if (location.pathname !== redirectPath) {
        navigate(redirectPath, { replace: true, state: navigationState });
      }

      setTimeout(() => {
        clearSession();
      }, 0);
    },
    [clearSession, location.pathname, navigate],
  );

  // logout is a function that handles the logout process by optionally sending a logout request to the backend
  //  (if an active token exists) and then finalizing the logout by navigating to a specified path and clearing 
  // the authentication session.
  const logout = useCallback(
    async (options = {}) => {
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
    },
    [authState.token, finalizeLogout],
  );

  // setMustChangePassword is a function that updates the authentication state to indicate whether the user must change their password,
  // and also updates the stored authentication session in local storage to reflect this change, 
  // ensuring that the application can enforce password change requirements for users when necessary.
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

  // login is a function that handles the login process by sending a login request to the backend with the provided credentials,
  // receiving the authentication token and user information in the response, 
  // storing the authentication session in local storage, applying the session to the authentication state, 
  // and navigating the user to their default route based on their role and session information.
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

  // useEffect hook that runs when the component mounts,
  // setting up authentication handlers for the API client to automatically include the authentication token in requests 
  // and handle unauthorized and forbidden responses by logging out the user or redirecting them to change their password if necessary.
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

  // contextValue is a memoized object that contains the current authentication state and the login, logout, 
  // and setMustChangePassword functions,
  // which is provided to the rest of the application through the AuthContext, 
  // allowing components to access authentication information and perform login/logout actions as needed.
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
