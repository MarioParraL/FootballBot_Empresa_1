import { FreshContext, MiddlewareHandler } from "$fresh/server.ts";

export const handler: MiddlewareHandler = async (
  req: Request,
  ctx: FreshContext,
) => {
  const headers = req.headers;
  const cookie = headers.get("Cookie");
  const name_cookie = cookie?.split(";").find((c) =>
    c.trim().startsWith("name=")
  );
  const password_cookie = cookie?.split(";").find((c) =>
    c.trim().startsWith("password=")
  );

  if (name_cookie && password_cookie) {
    const userName = name_cookie.split("=")[1];

    ctx.state.userName = userName;

    const next = await ctx.next();
    return next;
  }

  return new Response(null, {
    status: 302,
    headers: {
      location: "/",
    },
  });
};
