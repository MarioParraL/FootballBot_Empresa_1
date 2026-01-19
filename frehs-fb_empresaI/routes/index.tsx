import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(req) {
    return Response.redirect(
      new URL("/news", req.url),
      302,
    );
  },
};
