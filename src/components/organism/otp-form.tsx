"use client";

import { useState, useTransition, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GalleryVerticalEnd, Loader2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/shadcn/button";
import { Field, FieldDescription, FieldGroup } from "@/components/shadcn/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/shadcn/input-otp";
import {
  verifyOTP,
  signInWithOTP,
  getOTPSessionEmail,
} from "@/lib/actions/auth";

interface OTPFormProps extends React.ComponentProps<"div"> {
  initialEmail?: string;
}

export function OTPForm({ className, initialEmail, ...props }: OTPFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail || "");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPendingVerify, startVerifyTransition] = useTransition();
  const [isPendingResend, startResendTransition] = useTransition();
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isLoading, setIsLoading] = useState(!initialEmail);

  const isPending = isPendingVerify || isPendingResend;

  // Ambil email dari server jika tidak disediakan
  useEffect(() => {
    if (!initialEmail) {
      getOTPSessionEmail().then((sessionEmail) => {
        if (sessionEmail) {
          setEmail(sessionEmail);
        }
        setIsLoading(false);
      });
    }
  }, [initialEmail]);

  /**
   * Menyamarkan email untuk ditampilkan (keamanan)
   */
  const maskedEmail = email ? email.replace(/(.{2})(.*)(@.*)/, "$1***$3") : "";

  /**
   * Memulai timer cooldown untuk tombol kirim ulang
   */
  const startCooldown = useCallback(() => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  /**
   * Menangani verifikasi OTP
   */
  const handleVerify = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email) {
      setError("Sesi berakhir. Silakan kembali dan minta kode baru.");
      return;
    }

    if (otp.length !== 6) {
      setError("Masukkan kode 6 digit yang lengkap");
      return;
    }

    startVerifyTransition(async () => {
      const result = await verifyOTP(otp);

      if (result.success) {
        setSuccess("Verifikasi berhasil! Mengalihkan...");
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 500);
      } else {
        setError(result.error || "Verifikasi gagal");
        setOtp("");
      }
    });
  };

  /**
   * Menangani pengiriman ulang kode OTP
   */
  const handleResend = () => {
    if (!email || resendCooldown > 0) return;

    setError(null);
    setSuccess(null);
    setOtp("");

    startResendTransition(async () => {
      const result = await signInWithOTP(email);

      if (result.success) {
        setSuccess("Kode verifikasi baru telah dikirim ke email Anda");
        startCooldown();
      } else {
        setError(result.error || "Gagal mengirim ulang kode");
      }
    });
  };

  /**
   * Menangani perubahan input OTP
   */
  const handleOTPChange = (value: string) => {
    setOtp(value);
    setError(null);
  };

  // State loading saat mengambil email
  if (isLoading) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  // Email tidak ditemukan
  if (!email) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-muted-foreground">
            Sesi berakhir atau email tidak ditemukan. Silakan kembali ke login.
          </p>
          <Button onClick={() => router.push("/login")}>
            Kembali ke Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleVerify}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <Image src="/logo.svg" alt="Logo" width={100} height={100} />
            <h1 className="text-xl font-bold">Masukkan kode verifikasi</h1>
            <FieldDescription>
              Kami mengirim kode 6 digit ke{" "}
              <span className="font-medium text-foreground">{maskedEmail}</span>
            </FieldDescription>
          </div>

          {/* Pesan Error */}
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-center text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Pesan Sukses */}
          {success && (
            <div className="rounded-md bg-green-500/10 p-3 text-center text-sm text-green-600 dark:text-green-400">
              {success}
            </div>
          )}

          <Field>
            <InputOTP
              maxLength={6}
              id="otp"
              value={otp}
              onChange={handleOTPChange}
              disabled={isPending}
              containerClassName="gap-4 justify-center"
            >
              <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <FieldDescription className="text-center">
              Tidak menerima kode?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0 || isPending}
                className="text-primary underline underline-offset-4 hover:text-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPendingResend
                  ? "Mengirim..."
                  : resendCooldown > 0
                    ? `Kirim ulang dalam ${resendCooldown}d`
                    : "Kirim ulang"}
              </button>
            </FieldDescription>
          </Field>

          <Field>
            <Button type="submit" disabled={isPending || otp.length !== 6}>
              {isPendingVerify ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                "Verifikasi"
              )}
            </Button>
          </Field>

          <div className="text-center">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              ← Kembali ke login
            </button>
          </div>
        </FieldGroup>
      </form>

      <FieldDescription className="px-6 text-center">
        Dengan mengklik lanjutkan, Anda menyetujui{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Ketentuan Layanan
        </a>{" "}
        dan{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Kebijakan Privasi
        </a>{" "}
        kami.
      </FieldDescription>
    </div>
  );
}
