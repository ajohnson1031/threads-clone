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

export { createThread };
