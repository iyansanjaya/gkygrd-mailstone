import { z } from "zod/v4";

/**
 * Schema validasi email dengan pengecekan format yang tepat
 */
export const emailSchema = z
  .email("Masukkan alamat email yang valid")
  .min(1, "Email wajib diisi");

/**
 * Schema validasi token OTP
 * Memastikan tepat 6 digit angka
 */
export const otpTokenSchema = z
  .string()
  .length(6, "OTP harus tepat 6 digit")
  .regex(/^\d+$/, "OTP harus berisi angka saja");

/**
 * Definisi tipe untuk form autentikasi
 */
export type EmailInput = z.infer<typeof emailSchema>;
export type OTPTokenInput = z.infer<typeof otpTokenSchema>;
