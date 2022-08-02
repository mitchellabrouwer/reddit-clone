/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import Link from "next/link";
import { useEffect, useState } from "react";
import timeago from "../lib/timeago";
import NewComment from "./NewComment";
import { Vote } from "./Vote";

export default function Comment({ comment, post }) {
  const [showReply, setShowReply] = useState(false);
  const [vote, setVote] = useState<any>();
  const [votes, setVotes] = useState();

  useEffect(() => {
    const fetchVotes = async () => {
      const data = await fetch(`/api/vote?comment=${comment.id}`);
      const json = await data.json();
      setVote(json.vote);
      setVotes(json.votes);
    };
    // note: not optimised
    fetchVotes().catch((error) => console.log(error));
  }, []);

  return (
    <div className="mt-6 flex flex-row">
      <Vote post={post} vote={vote} votes={votes} />

      <div className="sjustify-center mb-4 px-10">
        <p>
          <Link href={`/u/${comment.author.name}`}>
            <a className="underline">{comment.author.name}</a>
          </Link>
          {` ${timeago.format(new Date(comment.createdAt))}`}
        </p>
        <p>{comment.content}</p>

        {showReply ? (
          <div className="pl-10">
            <NewComment post={post} comment={comment} />
          </div>
        ) : (
          <p
            className="cursor-pointer text-sm underline"
            onClick={() => setShowReply(true)}
          >
            reply
          </p>
        )}
      </div>
    </div>
  );
}
