import { useState } from "react";
import {
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth } from "../../firebase/config";
import { getAdminByUid } from "../../services/adminService";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const credential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      const admin =
        await getAdminByUid(
          credential.user.uid
        );

      if (!admin) {
        await auth.signOut();

        setError(
          "You do not have admin access."
        );

        return;
      }

      if (admin.status !== "active") {
        await auth.signOut();

        setError(
          "Your admin account is disabled."
        );

        return;
      }

      navigate("/admin/dashboard", {
        replace: true,
      });
    } catch (error: any) {
      console.error(error);

      setError(
        "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            BookHive
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Admin Panel
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
              placeholder="admin@bookhive.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}