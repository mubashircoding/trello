"use client";

import { List } from "@prisma/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { deleteList } from "@/actions/delete-list/Index";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, X } from "lucide-react";
import { useAction } from "@/hooks/use-action";
import { FormSubmit } from "@/components/form/form-submit";
import { Separator } from "@/components/ui/separator";
import { ElementRef, useRef } from "react";
import { copyList } from "@/actions/copy-list/Index";
interface ListOptionsProps {
  data: List;
  onAddCard: () => void;
}

export const ListOptions = ({ data, onAddCard }: ListOptionsProps) => {
  const closeRef = useRef<ElementRef<"button">>(null);  
  const { execute: executeDelete } = useAction(deleteList, {
    onSuccess: (data) => {
      toast.success(`list "${data.title}" deleted successfully`);
      closeRef.current?.click();
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  const { execute: executeCopy } = useAction(copyList, {
    onSuccess: (data) => {
      toast.success(`list "${data.title}" copied successfully`);
      closeRef.current?.click();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onDelete = (formData: FormData) => {
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;
    executeDelete({ id, boardId });
  };
  const onCopy = (formData: FormData) => {
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;
    executeCopy({ id, boardId });
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className=" h-auto w-auto p-2" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600">
          Live action
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            className=" h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          onClick={onAddCard}
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          variant="ghost"
        >
          Add card...
        </Button>
        <form action={onCopy}>
          <input hidden name="id" id="id" value={data.id} />
          <input hidden name="boardId" id="boardId" value={data.boardId} />
          <FormSubmit
            variant="ghost"
            className="rounded-none !w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          >
            Copy list..
          </FormSubmit>
        </form>
        <Separator />

        <form action={onDelete}>
          <input hidden name="id" id="id" value={data.id} />
          <input hidden name="boardId" id="boardId" value={data.boardId} />
          <FormSubmit
            variant="ghost"
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          >
            Delete this list
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};
