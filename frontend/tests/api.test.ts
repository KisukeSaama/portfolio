import { afterEach,describe,expect,it,vi } from "vitest";
import { apiLoader } from "~/lib/api";
describe("erreurs API",()=>{afterEach(()=>vi.unstubAllGlobals());it("transforme une réponse 404 en erreur de route",async()=>{vi.stubGlobal("fetch",vi.fn().mockResolvedValue(new Response("",{status:404})));await expect(apiLoader(new Request("http://localhost/projects/missing"),"/public/projects/missing")).rejects.toMatchObject({status:404})})});
