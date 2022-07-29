import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import Comments from "../../../../components/Comments";
import NewComment from "../../../../components/NewComment";
import { getPost, getSubreddit, getVote, getVotes } from "../../../../lib/data";
import prisma from "../../../../lib/prisma";

export default function Post({ subreddit, post, votes, vote }) {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const router = useRouter();

  const sendVote = async (up) => {
    await fetch("/api/vote", {
      body: JSON.stringify({
        post: post.id,
        up,
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    router.reload();
  };

  if (loading) {
    return null;
  }

  if (!post) {
    return <p className="p-5 text-center">Post does not exist</p>;
  }

  return (
    <>
      <header className="flex h-12 bg-black px-5 pt-3 pb-2 text-white">
        <Link href="/">
          <a className="underline">Home</a>
        </Link>
        <p className="grow" />
      </header>
      <header className="flex h-12 bg-black px-5 pt-3 pb-2 text-white">
        <p className="text-center">/r/{subreddit.name}</p>
        <p className="ml-4 grow text-left">{subreddit.description}</p>
      </header>

      <div className="mb-4 flex flex-row  justify-center px-10">
        <div className="border-3 my-10 mb-4 flex flex-col border-t border-l border-b border-black bg-gray-200 p-10 text-center">
          <div
            className="cursor-pointer"
            onClick={async (e) => {
              e.preventDefault();
              sendVote(true);
            }}
          >
            {vote?.up ? "⬆" : "↑"}
          </div>
          <div>{votes}</div>
          <div
            className="cursor-pointer"
            onClick={async (e) => {
              e.preventDefault();
              sendVote(false);
            }}
          >
            {/* eslint-disable-next-line no-nested-ternary */}
            {!vote ? "↓" : vote?.up ? "↓" : "⬇"}
          </div>
        </div>

        <div className="border-3 my-10 mb-4 flex flex-col border-t border-r border-b border-black bg-gray-200 p-10 pl-0">
          <div className="flex flex-shrink-0 pb-0 ">
            <div className="group block flex-shrink-0 ">
              <div className="flex items-center text-gray-800">
                Posted by
                <Link href={`/u/${post.author.name}`}>
                  <a className="ml-1 underline">{post.author.name}</a>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-1">
            <a className="color-primary width-auto flex-shrink text-2xl font-bold">
              {post.title}
            </a>
            {post.image && (
              <img
                className="takes-base color-primary width-auto mt-2 flex-shrink font-normal"
                src={post.image}
              ></img>
            )}
            <p className="color-primary width-auto mt-2 flex-shrink text-base font-normal">
              {post.content}
            </p>
          </div>

          {session ? (
            <NewComment post={post} comment={undefined} />
          ) : (
            <p className="mt-5">
              <Link href="/api/auth/signin">
                <a className="mr-1 underline">Login to comment</a>
              </Link>
            </p>
          )}

          <Comments comments={post.comments} post={post} />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  const subreddit = await getSubreddit(context.params.subreddit, prisma);
  let post = await getPost(parseInt(context.params.id, 10), prisma);
  post = JSON.parse(JSON.stringify(post));

  let votes = await getVotes(parseInt(context.params.id, 10), prisma);
  votes = JSON.parse(JSON.stringify(votes));

  let vote = await getVote(
    parseInt(context.params.id, 10),
    session?.user.id,
    prisma
  );
  vote = JSON.parse(JSON.stringify(vote));

  return {
    props: {
      subreddit,
      post,
      votes,
      vote,
    },
  };
}
