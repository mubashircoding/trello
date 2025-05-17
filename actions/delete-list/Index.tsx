"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-actions";
import { DeleteList } from "./schema";
import { redirect } from "next/navigation";

const handler = async (
    data:InputType
): Promise<ReturnType> =>{
    const {userId, orgId} = auth()

    if(!userId || !orgId){
        return {
            error:"Unauthorized"
        }
    }

    const {id, boardId} = data; 
    let list;
    try {
        list = await db.list.delete({
            where:{
                id,
                boardId,
                board:{
                    orgId,
                }
            },
            
        })
    } catch (error) {
        error:"Failed to Delete"
    }
    revalidatePath(`/board/${boardId}`)
    return{data: list}
}

export const deleteList = createSafeAction(DeleteList, handler)