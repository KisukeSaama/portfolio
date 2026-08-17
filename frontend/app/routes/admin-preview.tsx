import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import type { LoaderFunctionArgs,MetaFunction } from "react-router";
import { ProjectMedia } from "~/components/project-media";
import { apiLoader } from "~/lib/api";
import type { Project } from "~/types/api";
export const meta:MetaFunction=()=>[{title:"Prévisualisation privée"},{name:"robots",content:"noindex,nofollow,noarchive"}];
export async function loader({request,params}:LoaderFunctionArgs){return apiLoader<Project>(request,`/admin/projects/${params.id??""}/preview`)}
export default function AdminPreview({loaderData:p}:{loaderData:Project}){const cover=p.media.find(m=>m.type==="COVER");return <><div className="draft-banner">Prévisualisation privée · {p.publicationStatus} · visible uniquement avec une session ADMIN</div><article><header className="case-header"><div className="shell"><Link to={`/admin/projects/${p.id}/edit`} className="case-back text-link"><ArrowLeft size={17}/>Retour à l’éditeur</Link><h1>{p.title}</h1><div className="case-intro"><p>{p.fullDescription}</p><dl className="case-facts"><div><dt>Statut</dt><dd>{p.status}</dd></div><div><dt>Type</dt><dd>{p.projectType}</dd></div><div><dt>Rôle</dt><dd>{p.role}</dd></div></dl></div></div></header><div className="shell"><ProjectMedia media={cover} title={p.title} className="case-media"/><section className="case-section"><h2>Problème</h2><div className="case-content"><p>{p.problem}</p></div></section><section className="case-section"><h2>Solution</h2><div className="case-content"><p>{p.solution}</p></div></section><section className="case-section"><h2>Fonctionnalités</h2><div className="case-content"><ul>{p.features.map(item=><li key={item}>{item}</li>)}</ul></div></section></div></article></>}
