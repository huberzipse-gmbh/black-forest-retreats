import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/booking/ResetPasswordForm";

/** Neues Passwort setzen (Ziel des Reset-Links aus der E-Mail). */
export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
