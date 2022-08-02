import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import Posts from "../../components/Posts";
import {
  getFollowing,
  getPostsFromSubreddit,
  getSubreddit,
} from "../../lib/data";
import prisma from "../../lib/prisma";

export default function Subreddit({ subreddit, posts, following }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const loading = status === "loading";

  if (loading) {
    return null;
  }

  if (!subreddit) {
    return <p className="p-5 text-center">Subreddit does not exist</p>;
  }

  const sendJoin = async () => {
    await fetch("/api/following", {
      body: JSON.stringify({
        subreddit: subreddit.name,
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    router.reload();
  };

  console.log(following.some((sub) => sub.subredditName === subreddit.name));

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

      <div className="mt-4 w-full">
        <button
          type="button"
          className="btn m-auto mb-1 block rounded-full border px-4 font-bold"
          onClick={sendJoin}
        >
          {following.some((sub) => sub.subredditName === subreddit.name)
            ? "Joined"
            : "+ Join"}
        </button>
      </div>

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

export async function getServerSideProps(context) {
  const session = await getSession(context);

  const subreddit = await getSubreddit(context.params.subreddit, prisma);
  let posts = await getPostsFromSubreddit(
    context.params.subreddit,
    prisma,
    5,
    undefined
  );
  posts = JSON.parse(JSON.stringify(posts));

  const following = await getFollowing(session?.user.id, prisma);

  return {
    props: {
      subreddit,
      posts,
      following,
    },
  };
}
