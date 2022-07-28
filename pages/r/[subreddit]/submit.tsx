import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { getSubreddit } from "../../../lib/data";
import prisma from "../../../lib/prisma";

export default function NewPost({ subreddit }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);

  const { data: session, status } = useSession();
  const loading = status === "loading";

  if (loading) {
    return null;
  }

  if (!session) {
    return <p className="p-5 text-center">Not logged in 😞</p>;
  }

  if (!subreddit)
    return <p className="p-5 text-center">Subreddit does not exist 😞</p>;

  return (
    <>
      <header className="flex h-12 bg-black px-5 pt-3 pb-2 text-white">
        <Link href="/">
          <a className="underline">Home</a>
        </Link>
        <p className="grow"></p>
      </header>
      <header className="flex h-12 bg-black px-5 pt-3 pb-2 text-white">
        <Link href={`/r/${subreddit.name}`}>
          <a className="text-center underline">/r/{subreddit.name}</a>
        </Link>
        <p className="ml-4 grow text-left">{subreddit.description}</p>
      </header>

      <div className="mb-4 flex flex-row  justify-center px-10">
        <div className="border-3 my-10 mb-4 flex flex-col border border-black bg-gray-200 p-10">
          <form
            className="flex flex-col "
            onSubmit={async (e) => {
              e.preventDefault();
              if (!title) {
                alert("Enter a title");
                return;
              }
              if (!content && !image) {
                alert("Enter some text in the post");
                return;
              }

              const body = new FormData();
              body.append("title", title);
              body.append("content", content);
              body.append("subreddit_name", subreddit.name);
              body.append("image", image);

              const res = await fetch("/api/post", {
                body,
                method: "POST",
              });
              console.log(res);

              router.push(`/r/${subreddit.name}`);
            }}
          >
            <h2 className="mb-8 text-2xl font-bold">Create a post</h2>
            <input
              className="w-full border border-b-0 border-gray-700 bg-transparent p-4 text-lg font-medium outline-none  "
              placeholder="The post title"
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="w-full border border-gray-700 bg-transparent p-4 text-lg font-medium outline-none  "
              rows={5}
              cols={50}
              placeholder="The post content"
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="text-sm text-gray-600">
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label className="relative my-3 block cursor-pointer font-medium underline">
                {!imageURL && <p>Upload an image</p>}
                <img src={imageURL}></img>
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    if (event.target.files && event.target.files[0]) {
                      if (event.target.files[0].size > 3072000) {
                        alert("maximum size allowed is 3MB");
                        return false;
                      }
                      setImage(event.target.files[0]);
                      setImageURL(URL.createObjectURL(event.target.files[0]));
                    }
                    return true;
                  }}
                ></input>
              </label>
            </div>

            <div className="mt-5">
              <button
                type="submit"
                className="mt-0 mr-8 border border-gray-700 px-8 py-2 font-bold "
              >
                Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const subreddit = await getSubreddit(params.subreddit, prisma);

  return {
    props: {
      subreddit,
    },
  };
}
