import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET: () => {
    const headers = new Headers();
    headers.append("Set-Cookie", `name=; path=/; Max-Age=0`);
    headers.append("Set-Cookie", `password=; path=/; Max-Age=0`);
    headers.append("location", "/");
    return new Response(null, {
      status: 302,
      headers,
    });
  },
};
