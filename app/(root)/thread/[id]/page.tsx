import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { FC } from "react";

interface ThreadProps {
  params: {
    id: string;
  };
}

const Page: FC<ThreadProps> = async ({ params }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo.onboarded) redirect("/onboarding");

  const thread = await fetchThreadById(params.id);

  return (
    <section className="relative">
      <div>
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={user?.id || ""}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      </div>

      <div className="mt-7">
        <Comment threadId={thread.id} currentUserImg={userInfo.image} currentUserId={JSON.stringify(userInfo._id)} />
      </div>

      <div className="mt-10">
        {thread.children.map((childThread: any) => (
          <ThreadCard
            key={childThread._id}
            id={childThread._id}
            currentUserId={childThread?.id || ""}
            parentId={childThread.parentId}
            content={childThread.text}
            author={childThread.author}
            community={childThread.community}
            createdAt={childThread.createdAt}
            comments={childThread.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
};

export default Page;
