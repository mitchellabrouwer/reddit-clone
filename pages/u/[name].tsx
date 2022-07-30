import Link from "next/link";
import Comments from "../../components/Comments";
import Post from "../../components/Post";
import { getPostsFromUser, getUser } from "../../lib/data";
import prisma from "../../lib/prisma";

export default function Profile({ user, posts }) {
  console.log(posts);

  if (!user) {
    return <p className="p-5 text-center">User does not exist 😞</p>;
  }
  return (
    <>
      <header className="flex h-12 bg-black px-5 pt-3 pb-2 text-white">
        <Link href="/">
          <a className="underline">Home</a>
        </Link>
        <p className="grow"></p>
      </header>
      <header className="flex h-12 bg-black px-5 pt-3 pb-2 text-white">
        <p className="text-center">/u/{user.name}</p>
      </header>

      {posts.map((post) => {
        console.log(post.comments);
        return (
          <>
            <Post key={post.id} post={post} />
            <div className="mx-24">
              <Comments comments={post.comments} post={post} />
            </div>
          </>
        );
      })}
    </>
  );
}

export async function getServerSideProps({ params }) {
  let user = await getUser(params.name, prisma);
  user = JSON.parse(JSON.stringify(user));

  let posts = await getPostsFromUser(params.name, prisma);
  posts = JSON.parse(JSON.stringify(posts));

  return { props: { user, posts } };
}
