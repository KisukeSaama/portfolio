/**
 * Locale-independent profile data. Everything that reads as prose (title, tagline, availability,
 * alt text) lives in the dictionaries under app/i18n instead.
 */
export const profile = {
  name: "Jonathan Blanchard",
  photo: "/images/profile-placeholder.svg",
  cvUrl: "/documents/cv-jonathan-blanchard.pdf",
  cvAvailable: false,
  email: null,
  githubUrl: null,
  linkedinUrl: null,
} as const;
