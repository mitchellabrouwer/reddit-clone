import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import Posts from "../../components/Posts";
import { getPostsFromSubreddit, getSubreddit } from "../../lib/data";
import prisma from "../../lib/prisma";

export default function Subreddit({ subreddit, posts }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const loading = status === "loading";

  if (loading) {
    return null;
  }

  if (!subreddit) {
    return <p className="p-5 text-center">Subreddit does not exist</p>;
  }

  return (
    <>
      <header className="flex h-12 bg-black px-5 pt-3 pb-2 text-white">
        <Link href="/">
          <a className="underline">Home</a>
        </Link>
        <p className="grow" />
      </header>
      <header className="flex h-12 bg-black px-5 pt-3 pb-2 text-white ">
        <p className="text-center">/r/{subreddit.name}</p>
        <p className="text-left-grow ml-4">{subreddit.description}</p>
      </header>

      {session && (
        <div className="border-3 my-10 mx-20 border border-black p-10">
          <input
            placeholder="Create post"
            className="w-full border-2 border-gray-800 p-4"
            onClick={() => {
              router.push(`/r/${subreddit.name}/submit`);
            }}
          ></input>
        </div>
      )}

      <Posts posts={posts} />
    </>
  );
}

export async function getServerSideProps({ params }) {
  const subreddit = await getSubreddit(params.subreddit, prisma);
  let posts = await getPostsFromSubreddit(params.subreddit, prisma);
  posts = JSON.parse(JSON.stringify(posts));

  return {
    props: {
      subreddit,
      posts,
    },
  };
}
