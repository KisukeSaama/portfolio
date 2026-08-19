/**
 * Locale-independent profile data: contact details, links and asset paths. Everything that reads as
 * prose (title, tagline, availability, alt text) lives in the dictionaries under app/i18n instead.
 */
export const profile = {
  name: "Jonathan Blanchard",
  photo: "/images/jonathan-blanchard.jpg",
  /**
   * Drives the caption on the hero portrait. Set to `true` at the same time as `photo`, so the
   * "not published yet" note disappears with the placeholder it describes.
   */
  portraitAvailable: true,
  cvUrl: "/documents/cv-jonathan-blanchard.pdf",
  cvAvailable: true,
  /** The resume itself is written in French; the English UI says so next to the link. */
  cvLanguage: "fr",
  email: "jonathan.blanchard@epitech.eu",
  /** Display form and `tel:` form differ: the link needs E.164, the page reads better spaced out. */
  phone: "07 69 66 17 31",
  phoneHref: "tel:+33769661731",
  githubUrl: "https://github.com/KisukeSaama",
  linkedinUrl: "https://linkedin.com/in/jo-blanchard",
} as const;
