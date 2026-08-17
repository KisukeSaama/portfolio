import type { MetaFunction } from "react-router";
import { ProjectEditor } from "~/components/project-editor";
export const meta:MetaFunction=()=>[{title:"Nouveau projet — Administration"},{name:"robots",content:"noindex,nofollow"}];
export default function NewProject(){return <><header className="admin-head"><div><h1>Nouveau projet</h1><p>Le projet est créé comme brouillon privé.</p></div></header><ProjectEditor/></>}
