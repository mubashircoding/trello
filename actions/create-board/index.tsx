"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-actions";
import { CreateBoard } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { incrementAvailableCount, hasAvailableCount } from "@/lib/org-limit";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) {
    return {
      error: "Unautharized",
    };
  }
  const canCreate = await hasAvailableCount();
  if(!canCreate){
    return{
      error: "You have reached the limit of free boards you can create."
    }
  }
  const { title, image } = data;

  const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] =
    image.split("|");
  console.log({
    imageId,
    imageThumbUrl,
    imageFullUrl,
    imageLinkHTML,
    imageUserName,
  });

  if (
    !imageId ||
    !imageThumbUrl ||
    !imageFullUrl ||
    !imageLinkHTML ||
    !imageUserName
  ) {
    return {
      error: "Missing fields. Failed to create board.",
    };
  }

  let board;
  try {
    board = await db.board.create({
      data: {
        title,
        orgId,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName,
      },
    });
    await incrementAvailableCount();
    await createAuditLog({
      entityTitle: board.title,
      entityId: board.id,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.CREATE,
    });
  } catch (error) {
    return {
      error: "Failed to  create",
    };
  }
  revalidatePath(`/board/${board.id}`);
  return { data: board };
};
export const createBoard = createSafeAction(CreateBoard, handler);
// import { z } from "zod";

// import { db } from "@/lib/db";
// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";
// export type State = {
//   errors?: {
//     title?: string[];
//   };
//   message?: string | null;
// };
// const CreateBoard = z.object({
//   title: z.string().min(3, {
//     message: "minimum 3 letters",
//   }),
// });

// export async function create(prevState: State, formData: FormData) {
//   const validatedFields = CreateBoard.safeParse({
//     title: formData.get("title"),
//   });

//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: "Missing Fields",
//     };
//   }
//   const {title} = validatedFields.data
//   try{
//   await db.board.create({
//     data: {
//       title,
//     },
//   });
// } catch(error) {
//   return{
//     message: "Database Error",
//   }
// }
//   revalidatePath("/organization/org_2cYUZrnHihcy9WocLBOCCIAtER3");
//   redirect("/organization/org_2cYUZrnHihcy9WocLBOCCIAtER3");
// }
