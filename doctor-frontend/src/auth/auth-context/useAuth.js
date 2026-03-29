import { useContext } from "react";
import { AuthContext } from "./AuthContext";

// Custom hook to access the authentication context
// This hook can be used in any component that needs to access authentication state or functions
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
