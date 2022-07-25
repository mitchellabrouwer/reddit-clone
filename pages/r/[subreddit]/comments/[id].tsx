import Link from "next/link";
import { getPost, getSubreddit } from "../../../../lib/data";
import prisma from "../../../../lib/prisma";
import timeago from "../../../../lib/timeago";

export default function Post({ subreddit, post }) {
  if (!post) {
    return <p className="p-5 text-center">Post does not exist</p>;
  }

  return (
    <>
      <Link href="/">
        <a className="block p-5 text-center underline">
          🔙 back to the homepage
        </a>
      </Link>
      <Link href={`/r/${subreddit.name}`}>
        <a className="block p-5 text-center underline">
          🔙 back to /r/{subreddit.name}
        </a>
      </Link>
      <div className="border-3 mx-20 my-10 mb-4 flex flex-col border border-black bg-gray-200 p-10">
        <div className="flex flex-shrink-0 pb-0 ">
          <div className="group block flex-shrink-0 ">
            <div className="flex items-center text-gray-800">
              Posted by {post.author.name} **
              <p className="mx-2 underline">
                {timeago.format(new Date(post.createdAt))}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-1">
          <a className="color-primary width-auto flex-shrink text-2xl font-bold">
            {post.title}
          </a>
          <p className="color-primary width-auto mt-2 flex-shrink text-base font-normal">
            {post.content}
          </p>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  console.log(parseInt(params.id, 10));

  const subreddit = await getSubreddit(params.subreddit, prisma);
  let post = await getPost(parseInt(params.id), prisma);
  post = JSON.parse(JSON.stringify(post));

  return {
    props: {
      subreddit,
      post,
    },
  };
}
