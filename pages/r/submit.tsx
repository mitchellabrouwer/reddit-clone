import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function NewSubreddit() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data: session, status } = useSession();
  const loading = status === "loading";

  if (loading) {
    return null;
  }

  if (!session) {
    return <p className="p-5 text-center">Not logged in 😞</p>;
  }

  return (
    <>
      <header className="flex h-12 bg-black px-5 pt-3 pb-2 text-white">
        <Link href="/">
          <a className="underline">Home</a>
        </Link>
        <p className="grow"></p>
      </header>

      <div className="mb-4 flex flex-row  justify-center px-10">
        <div className="border-3 my-10 mb-4 flex flex-col border border-black bg-gray-200 p-10">
          <form
            className="flex flex-col "
            onSubmit={async (e) => {
              e.preventDefault();
              if (!name) {
                alert("Enter a name");
                return;
              }
              if (!description) {
                alert("Enter some text in the description");
                return;
              }

              const res = await fetch("/api/subreddit", {
                body: JSON.stringify({
                  name,
                  description,
                }),
                headers: { "Content-Type": "application/json" },
                method: "POST",
              });
              console.log(res);

              router.push(`/r/${name}`);
            }}
          >
            <h2 className="mb-8 text-2xl font-bold">Create a subreddit</h2>
            <input
              className="w-full border border-b-0 border-gray-700 bg-transparent p-4 text-lg font-medium outline-none  "
              placeholder="The subreddit name"
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              className="w-full border border-gray-700 bg-transparent p-4 text-lg font-medium outline-none  "
              rows={5}
              cols={50}
              placeholder="The subreddit description"
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="mt-5">
              <button
                type="submit"
                className="mt-0 mr-8 border border-gray-700 px-8 py-2 font-bold "
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
