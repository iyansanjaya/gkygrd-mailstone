"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ImageIcon, CalendarIcon, FileText } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { Textarea } from "@/components/shadcn/textarea";
import { Calendar } from "@/components/shadcn/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/popover";
import { createMilestone } from "@/lib/actions/milestones";

interface MilestoneFormProps {
  className?: string;
}

export function MilestoneForm({ className }: MilestoneFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState("");

  // Feedback state
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  /**
   * Validasi form sebelum submit
   */
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!title.trim()) {
      errors.title = "Judul wajib diisi";
    } else if (title.length > 200) {
      errors.title = "Judul maksimal 200 karakter";
    }

    if (!eventDate) {
      errors.eventDate = "Tanggal wajib diisi";
    }

    if (description.length > 2000) {
      errors.description = "Deskripsi maksimal 2000 karakter";
    }

    if (imageUrl && !isValidUrl(imageUrl)) {
      errors.imageUrl = "URL gambar tidak valid";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Validasi URL sederhana
   */
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      return;
    }

    startTransition(async () => {
      const result = await createMilestone({
        title: title.trim(),
        description: description.trim() || undefined,
        event_date: eventDate ? format(eventDate, "yyyy-MM-dd") : "",
        image_url: imageUrl.trim() || undefined,
      });

      if (result.success) {
        setSuccess("Milestone berhasil ditambahkan!");
        // Reset form
        setTitle("");
        setDescription("");
        setEventDate(undefined);
        setImageUrl("");
        setFieldErrors({});

        // Redirect ke home setelah 1.5 detik
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1500);
      } else {
        setError(result.error || "Gagal menambahkan milestone");
      }
    });
  };

  /**
   * Reset form
   */
  const handleReset = () => {
    setTitle("");
    setDescription("");
    setEventDate(undefined);
    setImageUrl("");
    setError(null);
    setSuccess(null);
    setFieldErrors({});
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="size-5" />
          Form Milestone
        </CardTitle>
        <CardDescription>
          Isi detail milestone yang ingin ditambahkan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup className="space-y-0">
            {/* Pesan Error Global */}
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

            {/* Judul */}
            <Field>
              <FieldLabel htmlFor="title">
                Judul <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="title"
                type="text"
                placeholder="Contoh: Ibadah Natal 2025"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (fieldErrors.title) {
                    setFieldErrors((prev) => ({ ...prev, title: "" }));
                  }
                }}
                disabled={isPending}
                maxLength={200}
                className={fieldErrors.title ? "border-destructive" : ""}
              />
              {fieldErrors.title && (
                <FieldError className="text-destructive">
                  {fieldErrors.title}
                </FieldError>
              )}
              <FieldDescription>{title.length}/200 karakter</FieldDescription>
            </Field>

            {/* Tanggal Event */}
            <Field>
              <FieldLabel>
                <span className="flex items-center gap-2">
                  <CalendarIcon className="size-4" />
                  Tanggal Event <span className="text-destructive">*</span>
                </span>
              </FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={isPending}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !eventDate && "text-muted-foreground",
                      fieldErrors.eventDate && "border-destructive",
                    )}
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {eventDate
                      ? format(eventDate, "d MMMM yyyy", { locale: id })
                      : "Pilih tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={eventDate}
                    onSelect={(date) => {
                      setEventDate(date);
                      if (fieldErrors.eventDate) {
                        setFieldErrors((prev) => ({ ...prev, eventDate: "" }));
                      }
                    }}
                    captionLayout="dropdown"
                    startMonth={new Date(new Date().getFullYear() - 100, 0)}
                    endMonth={new Date(new Date().getFullYear() + 50, 11)}
                  />
                </PopoverContent>
              </Popover>
              {fieldErrors.eventDate && (
                <FieldError className="text-destructive">
                  {fieldErrors.eventDate}
                </FieldError>
              )}
            </Field>

            {/* Deskripsi */}
            <Field>
              <FieldLabel htmlFor="description">Deskripsi</FieldLabel>
              <Textarea
                id="description"
                placeholder="Deskripsi detail tentang milestone ini..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (fieldErrors.description) {
                    setFieldErrors((prev) => ({ ...prev, description: "" }));
                  }
                }}
                disabled={isPending}
                rows={4}
                maxLength={2000}
                className={fieldErrors.description ? "border-destructive" : ""}
              />
              {fieldErrors.description && (
                <FieldError className="text-destructive">
                  {fieldErrors.description}
                </FieldError>
              )}
              <FieldDescription>
                {description.length}/2000 karakter (opsional)
              </FieldDescription>
            </Field>

            {/* URL Gambar */}
            <Field>
              <FieldLabel htmlFor="imageUrl">
                <span className="flex items-center gap-2">
                  <ImageIcon className="size-4" />
                  URL Gambar
                </span>
              </FieldLabel>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  if (fieldErrors.imageUrl) {
                    setFieldErrors((prev) => ({ ...prev, imageUrl: "" }));
                  }
                }}
                disabled={isPending}
                className={fieldErrors.imageUrl ? "border-destructive" : ""}
              />
              {fieldErrors.imageUrl && (
                <FieldError className="text-destructive">
                  {fieldErrors.imageUrl}
                </FieldError>
              )}
              <FieldDescription>
                Masukkan URL gambar dari sumber eksternal (opsional)
              </FieldDescription>
            </Field>

            {/* Preview Gambar */}
            {imageUrl && isValidUrl(imageUrl) && (
              <Field>
                <FieldLabel>Preview Gambar</FieldLabel>
                <div className="rounded-lg border overflow-hidden">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              </Field>
            )}

            {/* Tombol Aksi */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isPending}
                className="flex-1"
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={isPending || !title || !eventDate}
                className="flex-1"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Milestone"
                )}
              </Button>
            </div>

            {/* Link Kembali */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground cursor-pointer"
              >
                ← Kembali ke Beranda
              </button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
