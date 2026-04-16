import { FormEvent, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { GraduationCap, LogIn } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../lib/auth";

export function LoginPage() {
  const { user, demoUsers, login, loginAs } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("guru@demo.test");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");

  const redirectTo = (location.state as { from?: string } | null)?.from ?? "/";

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!login(email, password)) {
      setError("Email atau password demo tidak cocok.");
      return;
    }

    navigate(redirectTo, { replace: true });
  };

  const handleLoginAs = (userId: string) => {
    loginAs(userId);
    navigate(redirectTo, { replace: true });
  };

  return (
    <main className="min-h-screen bg-[#F1F5F9] px-4 py-8 text-gray-900 dark:bg-background dark:text-foreground">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-3xl items-center justify-center">
        <Card className="w-full shadow-lg">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#1E3A8A] text-white dark:bg-primary dark:text-primary-foreground">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-foreground">TEFA Presensi</p>
                <p className="text-sm text-gray-500 dark:text-muted-foreground">SMKN 1 Garut</p>
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl">Login</CardTitle>
              <p className="mt-2 text-sm text-gray-500 dark:text-muted-foreground">
                Pilih akun sesuai peran untuk mencoba dashboard presensi, siswa, SP, dan notifikasi.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="guru@demo.test"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="demo123"
                  />
                </div>
                {error && (
                  <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-400/40 dark:bg-red-400/10 dark:text-red-200">
                    {error}
                  </p>
                )}
                <Button type="submit" className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 dark:bg-primary dark:text-primary-foreground">
                  <LogIn className="h-4 w-4" />
                  Masuk
                </Button>
              </form>

              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-600 dark:text-muted-foreground">Akun demo cepat</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {demoUsers.map((demoUser) => (
                    <button
                      key={demoUser.id}
                      type="button"
                      onClick={() => handleLoginAs(demoUser.id)}
                      className="rounded-lg border border-gray-200 bg-white p-3 text-left transition hover:border-[#1E3A8A] hover:bg-blue-50 dark:border-border dark:bg-card dark:hover:border-primary dark:hover:bg-accent"
                    >
                      <p className="font-semibold text-gray-900 dark:text-foreground">{demoUser.name}</p>
                      <p className="text-xs text-gray-500 dark:text-muted-foreground">{demoUser.roleLabel}</p>
                      <p className="mt-2 text-xs text-gray-500 dark:text-muted-foreground">{demoUser.email}</p>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-muted-foreground">Semua akun demo memakai password: demo123</p>
              </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
