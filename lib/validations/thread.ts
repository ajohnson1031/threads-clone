import * as z from "zod";

const ThreadValidation = z.object({
  thread: z.string().min(3, { message: "Minimum three (3) characters" }),
  accountId: z.string(),
});

const CommentValidation = z.object({
  thread: z.string().min(3, { message: "Minimum three (3) characters" }),
});

export { CommentValidation, ThreadValidation };
