import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";

import getUsersCollection from "../db/User.ts";
import LoginForm from "../islands/LoginForm.tsx";

type Data = {
  error?: string;
};

export const handler: Handlers = {
  GET: async (req: Request, ctx: FreshContext<Data>) => {
    const url = new URL(req.url);
    const name = url.searchParams.get("name");
    const password = url.searchParams.get("password");
    const mode = url.searchParams.get("mode");

    const favorite = url.searchParams.get("favorite") || undefined;

    if (!name || !password) {
      return ctx.render();
    }
    const UsersCollection = await getUsersCollection();
    const existUser = await UsersCollection.findOne({ name });

    if (mode === "register") {
      if (existUser) {
        return ctx.render({ error: "Usuario ya registrado" });
      }

      await UsersCollection.insertOne({ name, password, favorite });
    } else if (mode === "login") {
      if (!existUser || existUser.password !== password) {
        return ctx.render({ error: "Usuario o contraseña incorrectos" });
      }
    }

    const headers = new Headers();
    headers.append("Set-Cookie", `name=${name}; path=/`);
    headers.append("Set-Cookie", `password=${password}; path=/`);
    headers.append("Location", "/news");

    return new Response(null, {
      status: 302,
      headers,
    });
  },
};

const Page = (props: PageProps<Data>) => {
  return <LoginForm error={props.data?.error} />;
};

export default Page;
