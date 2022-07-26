import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import LoadMore from "../components/LoadMore";
import Posts from "../components/Posts";
import { getFollowing, getJoinedPosts, getPosts } from "../lib/data";
import prisma from "../lib/prisma";

export default function Home({ initialPosts }) {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState(initialPosts);
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
        <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
          <a className="flex-l mb-1 rounded-full border px-4 font-bold">
            {session ? "logout" : "login"}
          </a>
        </Link>
      </header>

      {session && (
        <div className="border-3 my-10 mx-20 border border-black p-10">
          <input
            placeholder="Create subreddit"
            className="w-full border-2 border-gray-800 p-4"
            onClick={() => {
              router.push(`/r/submit`);
            }}
          ></input>
        </div>
      )}

      <Posts posts={posts} />
      <LoadMore posts={posts} setPosts={setPosts} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  const following = await getFollowing(session?.user.id, prisma);

  let posts = [
    ...(await getJoinedPosts(following, prisma, 10, undefined)),
    ...(await getPosts(prisma, 10, undefined)),
  ];

  posts = JSON.parse(JSON.stringify(posts));

  return {
    props: {
      initialPosts: posts,
    },
  };
}
