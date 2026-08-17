import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ProjectMedia } from "~/components/project-media";
import { defaultLocale } from "~/i18n/config";
import { getDictionary } from "~/i18n";
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
  const cover = project.media.find((media) => media.type === "COVER");
  return (
    <>
      <div className="draft-banner">
        Private preview · {project.publicationStatus} · visible only with an
        ADMIN session
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
            <div className="case-intro">
              <p>{project.fullDescription}</p>
              <dl className="case-facts">
                <div>
                  <dt>Status</dt>
                  <dd>{project.status}</dd>
                </div>
                <div>
                  <dt>Type</dt>
                  <dd>{project.projectType}</dd>
                </div>
                <div>
                  <dt>Role</dt>
                  <dd>{project.role}</dd>
                </div>
              </dl>
            </div>
          </div>
        </header>
        <div className="shell">
          <ProjectMedia
            media={cover}
            title={project.title}
            t={t}
            className="case-media"
          />
          <section className="case-section">
            <h2>Problem</h2>
            <div className="case-content">
              <p>{project.problem}</p>
            </div>
          </section>
          <section className="case-section">
            <h2>Solution</h2>
            <div className="case-content">
              <p>{project.solution}</p>
            </div>
          </section>
          <section className="case-section">
            <h2>Features</h2>
            <div className="case-content">
              <ul>
                {project.features.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
