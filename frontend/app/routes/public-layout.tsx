import { Outlet } from "react-router";
import { PublicFooter } from "~/components/public-footer";
import { PublicHeader } from "~/components/public-header";
export default function PublicLayout(){return <><PublicHeader/><main id="main-content"><Outlet/></main><PublicFooter/></>}
