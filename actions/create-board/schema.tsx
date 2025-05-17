import { db } from "@/lib/db"
import {z} from "zod"
export const CreateBoard = z.object({
    title: z.string({
        required_error: "Title",
        invalid_type_error: "ttt",
    }).min(3,{
        message: "Title is too short"
        })
        .refine(async (title) => {
            const existingBoard = await db.board.findFirst({
              where: { title },
            });
            return !existingBoard;
          }, {
            message: "Title already exists",
          }),
        image: z.string({ 
            required_error:"Image is required",
             invalid_type_error: "Image is required"
        }),
})