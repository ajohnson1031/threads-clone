import ThreadCard from "@/components/cards/ThreadCard";
import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { FC } from "react";

interface ThreadsTabProps {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const ThreadsTab: FC<ThreadsTabProps> = async ({ currentUserId, accountId, accountType }) => {
  let result = await fetchUserPosts(accountId);
  if (!result) redirect("/");

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.threads.map((thread: any) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={{
            name: accountType === "User" ? result.name : thread.author.name,
            image: accountType === "User" ? result.image : thread.author.image,
            id: accountType === "User" ? result.id : thread.author.id,
          }}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      ))}
    </section>
  );
};

export default ThreadsTab;
