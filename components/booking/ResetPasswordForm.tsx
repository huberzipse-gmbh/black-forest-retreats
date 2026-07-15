"use client";

/**
 * Neues Passwort setzen nach Klick auf den Reset-Link. Der Link trägt einen
 * Recovery-Token (token_hash); damit wird per verifyOtp eine kurzlebige Sitzung
 * hergestellt, danach kann updateUser das Passwort neu setzen.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useStrings } from "@/lib/i18n/I18nProvider";
import { createClient } from "@/lib/supabase/client";
import { Type } from "@/components/ui/Type";

type Phase = "checking" | "ready" | "invalid" | "done";

const input =
  "w-full rounded-[4px] border border-forest-900/20 bg-white px-4 py-3 font-body text-sm text-forest-900 outline-none transition-colors focus:border-forest-900";

export function ResetPasswordForm() {
  const t = useStrings().bookingFlow.account;
  const params = useSearchParams();
  const tokenHash = params.get("token_hash");

  const [phase, setPhase] = useState<Phase>("checking");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Token einlösen und Sitzung herstellen.
  useEffect(() => {
    let active = true;
    (async () => {
      if (!tokenHash) {
        setPhase("invalid");
        return;
      }
      const sb = createClient();
      const { error: e } = await sb.auth.verifyOtp({ type: "recovery", token_hash: tokenHash });
      if (!active) return;
      setPhase(e ? "invalid" : "ready");
    })();
    return () => {
      active = false;
    };
  }, [tokenHash]);

  const submit = async () => {
    if (busy || password.length < 6) return;
    setBusy(true);
    setError(null);
    try {
      const sb = createClient();
      const { error: e } = await sb.auth.updateUser({ password });
      if (e) throw e;
      setPhase("done");
    } catch {
      setError(t.resetPage.errGeneric);
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <Type role="h1" as="h1" className="text-forest-900">
        {t.resetPage.title}
      </Type>

      {phase === "checking" && (
        <p className="mt-4 font-body text-sm text-forest-700/75">{t.resetPage.checking}</p>
      )}

      {phase === "invalid" && (
        <div className="mt-4">
          <p className="font-body text-sm text-forest-700/75">{t.resetPage.invalid}</p>
          <Link
            href="/konto"
            className="mt-6 inline-flex items-center justify-center rounded-[3px] bg-brass-400 px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-night transition-colors hover:bg-brass-300"
          >
            {t.resetPage.backToLogin}
          </Link>
        </div>
      )}

      {phase === "ready" && (
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <p className="font-body text-sm text-forest-700/75">{t.resetPage.intro}</p>
          <div>
            <label className="mb-1.5 block font-body text-xs font-semibold text-forest-900">
              {t.resetPage.newPasswordLabel}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={input}
              autoComplete="new-password"
              minLength={6}
              required
            />
            <p className="mt-1.5 font-body text-xs text-forest-700/55">{t.passwordHint}</p>
          </div>
          {error && <p className="font-body text-sm text-red-800">{error}</p>}
          <button
            type="submit"
            disabled={busy || password.length < 6}
            className="rounded-[3px] bg-brass-400 px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-night transition-colors hover:bg-brass-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? t.working : t.resetPage.submit}
          </button>
        </form>
      )}

      {phase === "done" && (
        <div className="mt-4">
          <p className="font-body text-sm text-forest-700/75">{t.resetPage.done}</p>
          <Link
            href="/konto"
            className="mt-6 inline-flex items-center justify-center rounded-[3px] bg-brass-400 px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-night transition-colors hover:bg-brass-300"
          >
            {t.resetPage.toAccount}
          </Link>
        </div>
      )}
    </div>
  );
}
