import Link from "next/link";
import Posts from "../../components/Posts";
import { getPostsFromSubreddit, getSubreddit } from "../../lib/data";
import prisma from "../../lib/prisma";

export default function Subreddit({ subreddit, posts }) {
  console.log(subreddit);

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
