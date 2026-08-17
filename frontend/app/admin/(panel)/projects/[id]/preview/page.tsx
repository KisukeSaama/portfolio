import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CaseIntro, CaseStudyBody } from "~/components/case-study";
import { defaultLocale } from "~/i18n/config";
import { getDictionary } from "~/i18n";
import { publicationStatusLabels } from "~/lib/admin-labels";
import { requireAdmin } from "~/lib/require-admin";
import { serverApi } from "~/lib/server-api";
import type { Project } from "~/types/api";

export const metadata: Metadata = {
  title: "Private preview",
  robots: { index: false, follow: false, noarchive: true },
};

export default async function AdminPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = getDictionary(defaultLocale);
  await requireAdmin();
  const project = await serverApi<Project>(
    `/admin/projects/${encodeURIComponent(id)}/preview`,
    { authenticated: true, notFoundOn404: true },
  );

  return (
    <>
      <div className="draft-banner">
        Private preview · {publicationStatusLabels[project.publicationStatus]} ·
        visible only with an administrator session
      </div>
      <article>
        <header className="case-header">
          <div className="shell">
            <Link
              href={`/admin/projects/${project.id}/edit`}
              className="case-back text-link"
            >
              <ArrowLeft size={17} aria-hidden />
              Back to the editor
            </Link>
            <h1>{project.title}</h1>
            <CaseIntro project={project} t={t} />
          </div>
        </header>
        <div className="shell">
          {/* The same renderer the public page uses, so the preview cannot drift from it. */}
          <CaseStudyBody project={project} t={t} locale={defaultLocale} />
        </div>
      </article>
    </>
  );
}
