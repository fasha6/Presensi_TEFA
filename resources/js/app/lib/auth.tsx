import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type DemoRole =
  | "secretary"
  | "homeroom"
  | "major_head"
  | "teacher"
  | "student"
  | "parent"
  | "bk"
  | "student_affairs"
  | "curriculum"
  | "operator"
  | "principal";

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: DemoRole;
  roleLabel: string;
}

interface AuthContextValue {
  user: DemoUser | null;
  demoUsers: DemoUser[];
  login: (email: string, password: string) => boolean;
  loginAs: (userId: string) => void;
  logout: () => void;
}

const STORAGE_KEY = "presensi_demo_user_id";

export const demoUsers: DemoUser[] = [
  {
    id: "secretary",
    name: "Nadia Putri",
    email: "sekretaris@demo.test",
    password: "demo123",
    role: "secretary",
    roleLabel: "Siswa - Sekretaris XII RPL 1",
  },
  {
    id: "teacher",
    name: "Pak Budi",
    email: "guru@demo.test",
    password: "demo123",
    role: "teacher",
    roleLabel: "Guru Mata Pelajaran",
  },
  {
    id: "homeroom",
    name: "Bu Sari",
    email: "wali@demo.test",
    password: "demo123",
    role: "homeroom",
    roleLabel: "Wali Kelas",
  },
  {
    id: "major_head",
    name: "Pak Asep",
    email: "kaprodi@demo.test",
    password: "demo123",
    role: "major_head",
    roleLabel: "Kaprodi RPL",
  },
  {
    id: "bk",
    name: "Bu Rina",
    email: "bk@demo.test",
    password: "demo123",
    role: "bk",
    roleLabel: "Guru BK",
  },
  {
    id: "student_affairs",
    name: "Bu Hani",
    email: "kesiswaan@demo.test",
    password: "demo123",
    role: "student_affairs",
    roleLabel: "Waka Kesiswaan",
  },
  {
    id: "curriculum",
    name: "Pak Ahmad",
    email: "kurikulum@demo.test",
    password: "demo123",
    role: "curriculum",
    roleLabel: "Waka Kurikulum",
  },
  {
    id: "operator",
    name: "Admin Operator",
    email: "operator@demo.test",
    password: "demo123",
    role: "operator",
    roleLabel: "Operator",
  },
  {
    id: "principal",
    name: "Pak Dedi",
    email: "kepsek@demo.test",
    password: "demo123",
    role: "principal",
    roleLabel: "Kepala Sekolah",
  },
  {
    id: "student",
    name: "Ahmad Rizki Maulana",
    email: "siswa@demo.test",
    password: "demo123",
    role: "student",
    roleLabel: "Siswa",
  },
  {
    id: "parent",
    name: "Bapak Maulana",
    email: "ortu@demo.test",
    password: "demo123",
    role: "parent",
    roleLabel: "Orang Tua",
  },
];

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    const savedUserId = localStorage.getItem(STORAGE_KEY);
    const savedUser = demoUsers.find((item) => item.id === savedUserId) ?? null;

    setUser(savedUser);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      demoUsers,
      login: (email, password) => {
        const foundUser =
          demoUsers.find(
            (item) =>
              item.email.toLowerCase() === email.trim().toLowerCase() &&
              item.password === password,
          ) ?? null;

        if (!foundUser) {
          return false;
        }

        localStorage.setItem(STORAGE_KEY, foundUser.id);
        setUser(foundUser);
        return true;
      },
      loginAs: (userId) => {
        const foundUser = demoUsers.find((item) => item.id === userId);

        if (!foundUser) {
          return;
        }

        localStorage.setItem(STORAGE_KEY, foundUser.id);
        setUser(foundUser);
      },
      logout: () => {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
