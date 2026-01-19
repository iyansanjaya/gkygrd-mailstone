"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  ImageIcon,
  CalendarIcon,
  FileText,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/dialog";
import { updateMilestone, deleteMilestone } from "@/lib/actions/milestones";
import type { Milestone } from "@/lib/types/milestones";

interface MilestoneEditFormProps {
  milestone: Milestone;
  className?: string;
}

export function MilestoneEditForm({
  milestone,
  className,
}: MilestoneEditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Form state dengan initial values dari milestone
  const [title, setTitle] = useState(milestone.title);
  const [description, setDescription] = useState(milestone.description || "");
  const [eventDate, setEventDate] = useState<Date | undefined>(
    new Date(milestone.event_date),
  );
  const [imageUrl, setImageUrl] = useState(milestone.image_url || "");

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
      const result = await updateMilestone({
        id: milestone.id,
        title: title.trim(),
        description: description.trim() || undefined,
        event_date: eventDate ? format(eventDate, "yyyy-MM-dd") : undefined,
        image_url: imageUrl.trim() || undefined,
      });

      if (result.success) {
        setSuccess("Milestone berhasil diperbarui!");

        // Redirect ke home setelah 1.5 detik
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1500);
      } else {
        setError(result.error || "Gagal memperbarui milestone");
      }
    });
  };

  /**
   * Handle delete milestone
   */
  const handleDelete = () => {
    startDeleteTransition(async () => {
      const result = await deleteMilestone(milestone.id);

      if (result.success) {
        setDeleteDialogOpen(false);
        toast.success("Milestone berhasil dihapus!");
        // Gunakan window.location untuk redirect yang lebih reliable
        window.location.href = "/";
      } else {
        toast.error(result.error || "Gagal menghapus milestone");
        setDeleteDialogOpen(false);
      }
    });
  };

  /**
   * Reset form ke nilai awal
   */
  const handleReset = () => {
    setTitle(milestone.title);
    setDescription(milestone.description || "");
    setEventDate(new Date(milestone.event_date));
    setImageUrl(milestone.image_url || "");
    setError(null);
    setSuccess(null);
    setFieldErrors({});
  };

  const isPendingAny = isPending || isDeleting;

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5" />
              Edit Milestone
            </CardTitle>
            <CardDescription>Perbarui informasi milestone</CardDescription>
          </div>

          {/* Tombol Delete */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="icon" disabled={isPendingAny}>
                <Trash2 className="size-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Hapus Milestone?</DialogTitle>
                <DialogDescription>
                  Tindakan ini tidak dapat dibatalkan. Milestone &quot;
                  {milestone.title}&quot; akan dihapus secara permanen.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                  disabled={isDeleting}
                >
                  Batal
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Menghapus...
                    </>
                  ) : (
                    "Hapus"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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
                disabled={isPendingAny}
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
                    disabled={isPendingAny}
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
                    initialFocus
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
                disabled={isPendingAny}
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
                disabled={isPendingAny}
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
                disabled={isPendingAny}
                className="flex-1"
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={isPendingAny || !title || !eventDate}
                className="flex-1"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Perubahan"
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
