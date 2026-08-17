import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { cache } from "react";
import { CaseIntro, CaseStudyBody } from "~/components/case-study";
import { getDictionary, localePath } from "~/i18n";
import type { Locale } from "~/i18n/config";
import { NONCE_HEADER } from "~/lib/csp";
import { jsonLd } from "~/lib/json-ld";
import { serverApi } from "~/lib/server-api";
import type { Project } from "~/types/api";

export const dynamic = "force-dynamic";

type PageParams = { params: Promise<{ locale: Locale; slug: string }> };

const getProject = cache((slug: string) =>
  serverApi<Project>(`/public/projects/${encodeURIComponent(slug)}`, {
    notFoundOn404: true,
    revalidate: 0,
  }),
);

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProject(slug);
  const title = project.seoTitle || project.title;
  const description = project.seoDescription || project.shortDescription;
  const canonical = localePath(locale, `/${project.slug}`);
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      images: project.openGraphImageUrl
        ? [{ url: project.openGraphImageUrl, alt: project.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: project.openGraphImageUrl
        ? [project.openGraphImageUrl]
        : undefined,
    },
  };
}

export default async function ProjectPage({ params }: PageParams) {
  const { locale, slug } = await params;
  const t = getDictionary(locale);
  const nonce = (await headers()).get(NONCE_HEADER) ?? undefined;
  const project = await getProject(slug);

  return (
    <article>
      <header className="case-header">
        <div className="shell">
          <Link
            href={localePath(locale, "/projects")}
            className="case-back text-link"
          >
            <ArrowLeft size={17} aria-hidden />
            {t.caseStudy.allProjects}
          </Link>
          <h1>{project.title}</h1>
          <CaseIntro project={project} t={t} />
        </div>
      </header>
      <div className="shell">
        <CaseStudyBody project={project} t={t} locale={locale} />
      </div>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: project.title,
            description: project.shortDescription,
            applicationCategory:
              project.projectType === "PERSONAL"
                ? "DeveloperApplication"
                : "WebApplication",
          }),
        }}
      />
    </article>
  );
}
