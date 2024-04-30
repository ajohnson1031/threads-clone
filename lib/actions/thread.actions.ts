"use server";

import Thread from "@/lib/models/thread.model";
import User from "@/lib/models/user.model";
import { revalidatePath } from "next/cache";
import { connectToDB } from "./mongoose";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

const createThread = async ({ text, author, communityId, path }: Params) => {
  try {
    connectToDB();

    const createdThread = await Thread.create({ text, author, community: null });

    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed creating thread: ${error.message}`);
  }
};

const fetchPosts = async (pageNumber = 1, pageSize = 20) => {
  connectToDB();

  const skipAmount = (pageNumber - 1) * pageSize;

  // Fetch parentless posts | Top level threads
  const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: "author", model: User })
    .populate({ path: "children", populate: { path: "author", model: User, select: "_id name parentId image" } });

  const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } });
  const posts = await postsQuery.exec();
  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
};

export { createThread, fetchPosts };
