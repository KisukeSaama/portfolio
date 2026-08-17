import type { LoaderFunctionArgs,MetaFunction } from "react-router";
import { ProjectEditor } from "~/components/project-editor";
import { apiLoader } from "~/lib/api";
import type { Project } from "~/types/api";
export const meta:MetaFunction=()=>[{title:"Modifier un projet — Administration"},{name:"robots",content:"noindex,nofollow"}];
export async function loader({request,params}:LoaderFunctionArgs){return apiLoader<Project>(request,`/admin/projects/${params.id??""}`)}
export default function EditProject({loaderData}:{loaderData:Project}){return <><header className="admin-head"><div><h1>Modifier {loaderData.title}</h1><p>Dernière modification : {new Intl.DateTimeFormat("fr-FR",{dateStyle:"medium",timeStyle:"short"}).format(new Date(loaderData.updatedAt))}</p></div></header><ProjectEditor project={loaderData}/></>}
