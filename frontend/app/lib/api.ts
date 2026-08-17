import type { ApiError } from "~/types/api";

function baseUrl(request?: Request) {
  if (typeof window !== "undefined") return (import.meta.env.VITE_API_BASE_URL as string | undefined) || "/api/v1";
  return process.env.INTERNAL_API_BASE_URL || `${request ? new URL(request.url).origin : "http://localhost:8080"}/api/v1`;
}

export class ApiRequestError extends Error {
  constructor(public status:number,public payload:ApiError){super(payload.message);}
}

export async function apiLoader<T>(request:Request,path:string):Promise<T>{
  const headers:HeadersInit={Accept:"application/json"};const cookie=request.headers.get("cookie");if(cookie)headers.Cookie=cookie;
  const response=await fetch(`${baseUrl(request)}${path}`,{headers});
  if(!response.ok)throw new Response(response.status===404?"Introuvable":"Service indisponible",{status:response.status});
  return response.json() as Promise<T>;
}

let csrfToken:string|null=null;
async function csrf(){if(csrfToken)return csrfToken;const response=await fetch(`${baseUrl()}/auth/csrf`,{credentials:"include"});if(!response.ok)throw new Error("Impossible d’initialiser la protection de la requête.");const data=await response.json() as {token:string};csrfToken=data.token;return csrfToken;}

export async function apiMutation<T>(path:string,init:RequestInit={}){
  const token=await csrf();const headers=new Headers(init.headers);headers.set("Accept","application/json");headers.set("X-XSRF-TOKEN",token);
  if(init.body&&!headers.has("Content-Type")&&!(init.body instanceof FormData))headers.set("Content-Type","application/json");
  const response=await fetch(`${baseUrl()}${path}`,{...init,headers,credentials:"include"});
  if(response.status===403){csrfToken=null;}
  if(!response.ok){let payload:ApiError;try{payload=await response.json() as ApiError;}catch{payload={code:"network_error",message:"Le serveur n’a pas pu traiter la demande.",correlationId:"unknown"};}throw new ApiRequestError(response.status,payload);}
  if(response.status===204)return undefined as T;return response.json() as Promise<T>;
}

export function resetCsrf(){csrfToken=null;}
