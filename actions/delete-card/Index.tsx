
"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-actions";
import { DeleteCard } from "./schema";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

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
         await createAuditLog({
         entityTitle: card.title,
         entityId: card.id,
         entityType: ENTITY_TYPE.CARD,
         action: ACTION.CREATE,
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

