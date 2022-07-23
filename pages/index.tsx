import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Posts from "../components/Posts";
import { getPosts } from "../lib/data";
import prisma from "../lib/prisma";

export default function Home({ posts }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const loading = status === "loading";

  if (loading) {
    return null;
  }

  if (session && !session.user.name) {
    router.push("/setup");
  }

  return (
    <div>
      <Head>
        <title>Reddit Clone</title>
        <meta name="description" content="a great social network" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="flex h-12 bg-black px-5 pt-3 pb-2 text-white">
        <p>Reddit clone</p>
        <p className="grow" />
        <Link href="/api/auth/signin">
          <a className="flex-l mb-1 rounded-full border px-4 font-bold">
            login
          </a>
        </Link>
      </header>

      <Posts posts={posts} />
    </div>
  );
}

export async function getServerSideProps() {
  let posts = await getPosts(prisma);
  posts = JSON.parse(JSON.stringify(posts));
  return {
    props: {
      posts,
    },
  };
}
