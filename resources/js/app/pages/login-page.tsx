import { FormEvent, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { GraduationCap, LogIn } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../lib/auth";

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginState = (location.state as { from?: string; resetRedirect?: boolean } | null) ?? null;
  const redirectTo = loginState?.resetRedirect ? "/" : (loginState?.from ?? "/");

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

  return (
    <main className="min-h-screen bg-[#F1F5F9] px-4 py-8 text-gray-900 dark:bg-background dark:text-foreground">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center justify-center">
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
                Masukkan email dan password untuk masuk ke dashboard presensi.
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
                    placeholder="Masukkan email"
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Masukkan password"
                    autoComplete="current-password"
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
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
