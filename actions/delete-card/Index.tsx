
"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-actions";
import { DeleteCard } from "./schema";
import { redirect } from "next/navigation";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId } = data;
  let card;
  try {
    card= await db.card.delete({
      where: {
        id,
        list: {
          board: {
            orgId,
          },
        },
      }
    })
  } catch (error) {
    return {
      error: "Failed to Delete",
    };
  }
  revalidatePath(`/board/${boardId}`);
  return { data: card };
};
export const deleteCard = createSafeAction(DeleteCard, handler);

