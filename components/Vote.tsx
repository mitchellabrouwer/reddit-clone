import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export function Vote({ post, votes, vote }) {
  const router = useRouter();
  const { data: session } = useSession();

  const sendVote = async (up) => {
    if (session?.user) {
      await fetch("/api/vote", {
        body: JSON.stringify({
          post: post.id,
          up,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      router.reload();
    } else {
      router.push("/api/auth/signin");
    }
  };

  return (
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
  );
}
