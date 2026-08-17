import { render,screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe,expect,it } from "vitest";
import Home from "~/routes/home";
import { episort } from "./fixtures";
describe("portfolio public",()=>{it("présente Jonathan avant les preuves projet",()=>{render(<MemoryRouter><Home loaderData={{projects:[episort]}}/></MemoryRouter>);const hero=screen.getByRole("heading",{level:1,name:/Développeur full-stack/});const project=screen.getByRole("heading",{level:3,name:"Episort"});expect(hero.compareDocumentPosition(project)&Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();expect(screen.getByText(/problèmes concrets, de l’idée à l’interface/)).toBeInTheDocument()})});
