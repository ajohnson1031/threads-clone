"use server";

import Thread from "@/lib/models/thread.model";
import User from "@/lib/models/user.model";
import { revalidatePath } from "next/cache";
import { connectToDB } from "./mongoose";

interface CreateThreadParams {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

const createThread = async ({ text, author, communityId, path }: CreateThreadParams) => {
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

const fetchThreadById = async (id: string) => {
  try {
    connectToDB();

    const thread = await Thread.findById(id)
      .populate({ path: "author", model: User, select: "_id id name image" })
      .populate({
        path: "children",
        populate: [
          { path: "author", model: User, select: "_id id name parentId image" },
          { path: "children", model: Thread, populate: { path: "author", model: User, select: "_id id name parentId image" } },
        ],
      });

    return thread;
  } catch (error: any) {
    throw new Error(`Failed fetching thread: ${error.message}`);
  }
};

interface AddCommentParams {
  threadId: string;
  commentText: string;
  userId: string;
  path: string;
}

const addCommentToThread = async ({ threadId, commentText, userId, path }: AddCommentParams) => {
  try {
    connectToDB();

    const originalThread = await Thread.findById(threadId);

    if (!originalThread) throw new Error("Thread not found");

    const commentThread = new Thread({ text: commentText, author: userId, parentId: threadId });
    const savedCommentThread = await commentThread.save();

    originalThread.children.push(savedCommentThread._id);

    await originalThread.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed adding comment: ${error.message}`);
  }
};

export { addCommentToThread, createThread, fetchPosts, fetchThreadById };
