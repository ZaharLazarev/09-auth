"use client";
import { TailSpin } from "react-loader-spinner";
import { useEffect, useState } from "react";

import { useAuthStore } from "@/lib/store/authStore";
import { checkSession, getMe } from "@/lib/api/clientApi";

interface AuthProviderProps {
  children: React.ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);

      const isAuthenticated = await checkSession();

      if (!isAuthenticated) {
        clearIsAuthenticated();
        setLoading(false);
        return;
      }

      const user = await getMe();

      if (user) {
        setUser(user);
      } else {
        clearIsAuthenticated();
      }

      setLoading(false);
    };

    fetchUser();
  }, [setUser, clearIsAuthenticated]);

  return loading ? (
    <TailSpin
      height="80"
      width="80"
      color="#4fa94d"
      ariaLabel="tail-spin-loading"
      visible
    />
  ) : (
    <>{children}</>
  );
}
export default AuthProvider;
