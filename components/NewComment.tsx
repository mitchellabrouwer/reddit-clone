import { useRouter } from "next/router";
import { useState } from "react";

export default function NewComment({ post }) {
  const router = useRouter();
  const [content, setContent] = useState("");

  return (
    <form
      className="mt-10 flex flex-col"
      onSubmit={async (e) => {
        e.preventDefault();

        if (!content) {
          alert("into some text into the comment");
          return;
        }

        const res = await fetch("/api/comment", {
          body: JSON.stringify({ post: post.id, content }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });

        console.log(res);
        router.reload();
      }}
    >
      <textarea
        className="w-full border border-gray-500 bg-transparent p-4 text-lg font-medium outline-none"
        rows={1}
        cols={50}
        placeholder="Add a comment"
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="mt-5">
        <button
          type="submit"
          className="mt-0 mr-8 border border-gray-700 px-8 py-2 font-bold"
        >
          Comment
        </button>
      </div>
    </form>
  );
}
