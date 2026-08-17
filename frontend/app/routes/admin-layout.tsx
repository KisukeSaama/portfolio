import { Outlet,redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { AdminMobile,AdminSidebar } from "~/components/admin-nav";
import { apiLoader } from "~/lib/api";
import type { Session } from "~/types/api";
export async function loader({request}:LoaderFunctionArgs){const session=await apiLoader<Session>(request,"/auth/session");if(!session.authenticated)throw redirect("/admin/login");return {session}}
export default function AdminLayout(){return <div className="admin-shell"><AdminSidebar/><AdminMobile/><main className="admin-main" id="main-content"><Outlet/></main></div>}
