"use client";

/** E-Mail-Log mit aufklappbarer HTML-Vorschau (iframe srcdoc, sandboxed). */
import { useState, useTransition } from "react";
import { dateTimeDe } from "@/lib/admin/format";
import { resendLoggedEmail } from "@/app/admin/actions";

interface EmailRow {
  id: string;
  to: string;
  subject: string;
  html: string;
  provider: string;
  createdAt: string;
}

export function EmailOutbox({ emails }: { emails: EmailRow[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ id: string; text: string; ok: boolean } | null>(null);

  const resend = (mail: EmailRow) => {
    setFeedback(null);
    startTransition(async () => {
      const res = await resendLoggedEmail(mail.id);
      setFeedback(
        res.ok
          ? { id: mail.id, text: `Erneut an ${mail.to} gesendet.`, ok: true }
          : { id: mail.id, text: res.error ?? "Versand fehlgeschlagen.", ok: false },
      );
    });
  };

  if (emails.length === 0) {
    return (
      <div className="rounded-[8px] border border-forest-900/10 bg-white px-6 py-10 text-center font-body text-sm text-forest-700/60">
        Noch keine E-Mails. Die erste entsteht mit der ersten Buchung.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {emails.map((mail) => (
        <div key={mail.id} className="rounded-[8px] border border-forest-900/10 bg-white">
          <button
            type="button"
            className="flex w-full flex-wrap items-center justify-between gap-3 px-5 py-4 text-start"
            onClick={() => setOpenId(openId === mail.id ? null : mail.id)}
          >
            <div>
              <div className="font-body text-sm font-semibold text-forest-900">{mail.subject}</div>
              <div className="mt-0.5 font-body text-xs text-forest-700/60">
                an {mail.to} · {dateTimeDe(mail.createdAt)}
              </div>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 font-body text-[0.65rem] font-semibold uppercase tracking-wider ${
                mail.provider === "demo" ? "bg-brass-400/20 text-brass-600" : "bg-forest-900/10 text-forest-900"
              }`}
            >
              {mail.provider === "demo" ? "Demo (nicht versendet)" : "Resend"}
            </span>
          </button>
          {openId === mail.id && (
            <div className="border-t border-forest-900/10 p-4">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => resend(mail)}
                  disabled={isPending}
                  className="rounded-[3px] bg-forest-900 px-4 py-2 font-body text-xs font-semibold uppercase tracking-wider text-cream-50 transition-colors hover:bg-forest-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? "Wird gesendet …" : "Erneut senden"}
                </button>
                {feedback?.id === mail.id && (
                  <span
                    className={`font-body text-xs ${
                      feedback.ok ? "text-forest-700" : "text-red-700"
                    }`}
                  >
                    {feedback.text}
                  </span>
                )}
                <span className="font-body text-xs text-forest-700/50">
                  Etwaige PDF-Anhänge werden nicht erneut mitgeschickt.
                </span>
              </div>
              <iframe
                title={mail.subject}
                srcDoc={mail.html}
                sandbox=""
                className="h-[560px] w-full rounded-[6px] border border-forest-900/10 bg-cream-50"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
