"use client"

import { Card } from "@prisma/client";
import { Draggable  } from "@hello-pangea/dnd";
import { useCardModal } from "@/hooks/use-card-modal";
interface CardItemProps{
    data:Card;
    index:number;
}
export const CardItem = ({
    data,
    index,
}:CardItemProps) => {
    const cardModal = useCardModal();
    return(
        <Draggable draggableId={data.id} index={index}> 
        {(provided)=>(
        <div
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        onClick={()=>cardModal.onOpen(data.id)}
        // onClick={()=>console.log(data.id)}
        role="button"
        className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm rounded-md bg-white shadow-sm"
        >
            {data.title}
        </div>
    )}
        </Draggable>
    )
}