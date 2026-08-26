import {
  onAuthStateChanged,
  type User,
} from "firebase/auth";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { auth } from "../firebase/config";
import {
  getAdminByUid,
  type Admin,
} from "../services/adminService";

interface AuthContextType {
  user: User | null;
  admin: Admin | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        try {
          setUser(currentUser);

          if (currentUser) {
            const adminData =
              await getAdminByUid(currentUser.uid);

            setAdmin(adminData);
          } else {
            setAdmin(null);
          }
        } catch (error) {
          console.error(
            "Failed to load admin profile:",
            error
          );

          setAdmin(null);
        } finally {
          setLoading(false);
        }
      }
    );

    return unsubscribe;
  }, []);

  const logout = async () => {
    await auth.signOut();
  };

  const isAdmin =
    !!user &&
    !!admin &&
    admin.status === "active";

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        loading,
        isAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}