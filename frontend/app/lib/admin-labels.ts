/**
 * Human labels for the enums the API returns. The administration area is English-only, so these are
 * plain constants rather than dictionary entries; the public side reads its status and type wording
 * from `t.projects` instead, because it has to translate.
 *
 * Without these the panel prints raw enum names (`PUBLISHED`, `COVER`) straight into the interface.
 */
import type { MediaType, PublicationStatus } from "~/types/api";

export const publicationStatusLabels: Record<PublicationStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

export const mediaTypeLabels: Record<MediaType, string> = {
  COVER: "Cover",
  VIDEO: "Video",
  POSTER: "Poster",
  GALLERY: "Gallery",
};

export const auditActionLabels: Record<string, string> = {
  LOGIN_SUCCESS: "Sign-in succeeded",
  LOGIN_FAILURE: "Sign-in refused",
  LOGOUT: "Sign-out",
  PROJECT_CREATE: "Project created",
  PROJECT_UPDATE: "Project updated",
  PROJECT_DUPLICATE: "Project duplicated",
  PROJECT_PUBLISH: "Project published",
  PROJECT_UNPUBLISH: "Project unpublished",
  PROJECT_ARCHIVE: "Project archived",
  PROJECT_RESTORE: "Project restored",
  PROJECT_DELETE: "Project deleted",
  PROJECT_REORDER: "Order changed",
  PROJECT_SLUG_CHANGE: "Slug changed",
  MEDIA_ADD: "Media added",
  MEDIA_DELETE: "Media deleted",
};

/** `1 project` / `2 projects`, so the panel stops printing "project(s)". */
export function count(
  value: number,
  singular: string,
  plural = `${singular}s`,
) {
  return `${value} ${value === 1 ? singular : plural}`;
}
