import { type FormEvent, useState } from "react";
import { LogIn, ShieldCheck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const AUTH_TOKEN_STORAGE_KEY = "authToken";
const AUTH_USER_STORAGE_KEY = "authUserName";

const API_BASE = normalizeApiBase(import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? "/api" : ""));
const API_BASE_FALLBACK = normalizeApiBase(import.meta.env.VITE_API_BASE_FALLBACK_URL ?? "");

type AuthApiResponse = {
  token?: string;
  user?: {
    name?: string;
  };
  message?: string;
  Message?: string;
};

type AuthState = {
  token: string;
  name: string;
};

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authState, setAuthState] = useState<AuthState>(() => ({
    token: window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) ?? "",
    name: window.localStorage.getItem(AUTH_USER_STORAGE_KEY) ?? "",
  }));

  const isLoggedIn = authState.token.trim().length > 0;

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = loginName.trim();
    const password = loginPassword.trim();

    if (!name || !password) {
      toast.error("Enter both username and password.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetchAuthApi("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, password }),
      });

      if (isLikelyHtmlResponse(response)) {
        throw new Error("Could not reach the auth server. Check API base URL settings.");
      }

      const payload = await readAuthPayload(response);

      if (!response.ok) {
        throw new Error(resolveApiMessage(payload) || "Login failed");
      }

      const token = payload.token?.trim() ?? "";
      const userName = payload.user?.name?.trim() || name;

      if (!token) {
        throw new Error("Login succeeded but no token was returned.");
      }

      window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
      window.localStorage.setItem(AUTH_USER_STORAGE_KEY, userName);
      setAuthState({ token, name: userName });
      setLoginPassword("");
      toast.success(`Welcome back, ${userName}!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to log in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = registerName.trim();
    const password = registerPassword.trim();
    const confirmPassword = registerConfirmPassword.trim();

    if (!name || !password || !confirmPassword) {
      toast.error("Fill out all registration fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetchAuthApi("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, password }),
      });

      if (!response.ok) {
        const payload = await readAuthPayload(response);
        const apiMessage = resolveApiMessage(payload) || "Unable to create account.";
        throw new Error(apiMessage);
      }

      toast.success("Account created. You can now log in.");
      setActiveTab("login");
      setLoginName(name);
      setLoginPassword("");
      setRegisterPassword("");
      setRegisterConfirmPassword("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to register account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    setAuthState({ token: "", name: "" });
    toast.success("Logged out.");
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-start justify-center px-3 pb-8 pt-6 sm:px-5 sm:pt-10 lg:pt-[12vh]">
      <div className="w-full max-w-3xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">Account</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Sign in or create account</h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">Use your account to save authenticated actions as new features are added.</p>
        </div>

        <div className="mx-auto mt-6 max-w-xl overflow-hidden rounded-[1.45rem] border border-border/80 bg-[linear-gradient(160deg,hsl(0_0%_100%_/_0.9),hsl(204_50%_96%_/_0.92))] p-4 shadow-[0_24px_50px_hsl(208_45%_58%_/_0.24)] backdrop-blur-xl sm:p-6">
          {isLoggedIn ? (
            <div className="space-y-4 rounded-xl border border-border/70 bg-background/50 p-4 sm:p-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700">
                <ShieldCheck className="h-4 w-4" />
                Logged in
              </div>
              <p className="text-lg font-medium text-foreground">Signed in as {authState.name || "user"}</p>
              <p className="text-sm text-muted-foreground">Your token is stored locally in this browser.</p>
              <Button type="button" variant="outline" onClick={handleLogout}>
                Log out
              </Button>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Create Account
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-4">
                <form className="space-y-4" onSubmit={handleLogin}>
                  <div className="space-y-2">
                    <Label htmlFor="login-name">Username</Label>
                    <Input
                      id="login-name"
                      autoComplete="username"
                      placeholder="your-username"
                      value={loginName}
                      onChange={(e) => setLoginName(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Log in"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="mt-4">
                <form className="space-y-4" onSubmit={handleRegister}>
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Username</Label>
                    <Input
                      id="register-name"
                      autoComplete="username"
                      placeholder="Choose a username"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Create a password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">Confirm password</Label>
                    <Input
                      id="register-confirm-password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Confirm your password"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Creating account..." : "Create account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}

function buildApiUrl(path: string, base = API_BASE): string {
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function normalizeApiBase(rawBase: string): string {
  const trimmedBase = rawBase.trim().replace(/\/+$/, "");
  if (!trimmedBase) {
    return "";
  }

  if (trimmedBase.startsWith("/")) {
    return trimmedBase;
  }

  try {
    const url = new URL(trimmedBase);
    const pathname = url.pathname.replace(/\/+$/, "");
    if (!pathname) {
      return url.origin;
    }
    return trimmedBase;
  } catch {
    return trimmedBase;
  }
}

async function fetchAuthApi(path: string, init: RequestInit): Promise<Response> {
  const primaryBase = API_BASE.length > 0 ? API_BASE : API_BASE_FALLBACK;

  if (primaryBase.length === 0) {
    throw new Error("Missing API base URL. Set VITE_API_BASE_URL for production deployments.");
  }

  const primaryResponse = await fetch(buildApiUrl(path, primaryBase), init);

  if (
    !shouldTryFallback(primaryResponse) ||
    API_BASE_FALLBACK.length === 0 ||
    API_BASE_FALLBACK === primaryBase
  ) {
    return primaryResponse;
  }

  return fetch(buildApiUrl(path, API_BASE_FALLBACK), init);
}

function shouldTryFallback(response: Response): boolean {
  if (response.status === 404 || response.status === 502 || response.status === 503 || response.status === 504) {
    return true;
  }

  const contentType = response.headers.get("content-type") ?? "";
  return contentType.includes("text/html");
}

function resolveApiMessage(payload: AuthApiResponse): string {
  if (typeof payload.message === "string" && payload.message.trim()) {
    return payload.message.trim();
  }

  if (typeof payload.Message === "string" && payload.Message.trim()) {
    return payload.Message.trim();
  }

  return "";
}

function isLikelyHtmlResponse(response: Response): boolean {
  const contentType = response.headers.get("content-type") ?? "";
  return contentType.includes("text/html");
}

async function readAuthPayload(response: Response): Promise<AuthApiResponse> {
  const text = await response.text();
  if (!text.trim()) {
    return {};
  }

  try {
    return JSON.parse(text) as AuthApiResponse;
  } catch {
    return { message: text.trim() };
  }
}
