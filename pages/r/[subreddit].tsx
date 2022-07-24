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
      <Link href="/">
        <a className="block p-5 text-center underline">
          🔙 back to the homepage
        </a>
      </Link>
      <p className="p-5 text-center">/r/{subreddit.name}</p>;
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
