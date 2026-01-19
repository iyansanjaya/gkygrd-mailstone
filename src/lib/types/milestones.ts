/**
 * Definisi tipe Milestone
 * Merepresentasikan catatan internal untuk event, aktivitas, dll.
 */

export interface Milestone {
  id: string;
  title: string;
  description: string | null;
  event_date: string; // String tanggal ISO
  image_url: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

/**
 * Tipe input untuk membuat milestone baru
 */
export interface CreateMilestoneInput {
  title: string;
  description?: string;
  event_date: string;
  image_url?: string;
}

/**
 * Tipe input untuk memperbarui milestone yang ada
 */
export interface UpdateMilestoneInput {
  id: string;
  title?: string;
  description?: string;
  event_date?: string;
  image_url?: string;
}
