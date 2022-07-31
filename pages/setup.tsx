import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function SetUp() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [isError, setIsError] = useState(null);
  console.log(isError);
  const [name, setName] = useState("");
  if (loading) {
    return null;
  }

  if (!session || !session.user) {
    router.push("/");
    return null;
  }

  if (!loading && session && session.user.name) {
    return router.push("/");
  }

  return (
    <form
      className="mt-10 ml-20"
      onSubmit={async (e) => {
        e.preventDefault();

        const response = await fetch("/api/setup", {
          body: JSON.stringify({
            name,
          }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });
        if (response.status === 200) {
          // setIsError(null);
          session.user.name = name;
          router.push("/");
        } else if (response.status === 422) {
          const setup = await response.json();
          setIsError(setup.message);
        }
      }}
    >
      <div className="mb-5 flex-1">
        <div className="mb-5 flex-1">Choose a username</div>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-1"
          required
          pattern="\w*"
          title="Numbers or letters or _ only"
          placeholder="Numbers or letters or _ only"
          minLength={5}
        />
      </div>

      {isError && <div className="italic text-red-800">{isError}</div>}

      <button
        type="submit"
        className="mt-0 mr-8 rounded-full  border px-8 py-2 font-bold"
      >
        Save
      </button>
    </form>
  );
}
