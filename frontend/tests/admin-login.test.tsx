import { render,screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe,expect,it } from "vitest";
import AdminLogin from "~/routes/admin-login";
describe("administration",()=>{it("affiche une connexion sans inscription",()=>{render(<MemoryRouter><AdminLogin/></MemoryRouter>);expect(screen.getByRole("heading",{name:"Connexion"})).toBeInTheDocument();expect(screen.queryByText(/créer un compte/i)).not.toBeInTheDocument()})});
