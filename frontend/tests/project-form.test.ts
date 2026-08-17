import { describe, expect, it } from "vitest";
import { defaults, projectFormSchema, slugify } from "~/lib/project-form";

describe("project editor", () => {
  it("builds a stable slug from accented input", () =>
    expect(slugify("Mini réseau social !")).toBe("mini-reseau-social"));
  it("rejects an incomplete draft", () => {
    const result = projectFormSchema.safeParse(defaults());
    expect(result.success).toBe(false);
  });
  it("rejects unsafe slugs", () => {
    const value = {
      ...defaults(),
      title: "Valid project",
      slug: "Invalid Project",
      shortDescription: "A short description that is precise enough.",
      fullDescription:
        "A full description long enough to pass every validation rule.",
      problem: "A concrete problem with enough detail.",
      solution: "A solution described with enough detail.",
      role: "Project design and development.",
    };
    expect(projectFormSchema.safeParse(value).success).toBe(false);
  });
});
