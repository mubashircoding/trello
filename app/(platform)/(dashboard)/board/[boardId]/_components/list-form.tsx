"use client";
import { Plus, X } from "lucide-react";
import { useState, useRef, ElementRef } from "react";
import { ListWrapper } from "./list-wrapper";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { FormInput } from "@/components/form/form-input";
import { useAction } from "@/hooks/use-action";
import { createList } from "@/actions/create-list/Index";
import { PathParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { useParams, useRouter } from "next/navigation";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
export const ListForm = () => {
    const router = useRouter();
    const params = useParams()
    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);
    const [isEditing, setIsEditing] = useState(false);
    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() =>{
            inputRef.current?.focus();
        })
    }
    const disabledEditing = () => {
        setIsEditing(false);
    };
     const {execute,fieldErrors} =useAction(createList, {
        onSuccess:(data)=> {
            toast.success(`List "${data.title}" created`);
            disabledEditing();
            router.refresh()

        },
            onError: (error) =>{
                toast.error(error)
            }
     })
    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key ===  "Escape") {
            disabledEditing();
        }
    }


    useEventListener("keydown", onKeyDown);
    useOnClickOutside(formRef, disabledEditing);
    const onSubmit = (FormData:FormData)=>{
        const title = FormData.get("title") as string
        const boardId = FormData.get("boardId") as string
        execute({
            title,
            boardId
        })
    }
    if (isEditing) {
        return(
            <ListWrapper>
                <form action={onSubmit} className="w-full p-3 rounded-md bg-white space-y-4 shadow-md" ref={formRef}>
                    <FormInput
                    ref={inputRef}
                    errors={fieldErrors}
                    id="title"
                    className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
                    placeholder="Enter list title...."
                    />
                    <input
                    hidden
                    value={params.boardId}
                    name="boardId"
                    />
                    <div className="flex items-center gap-x-1">
                        <FormSubmit>
                            Add list
                        </FormSubmit>
                        <Button onClick={disabledEditing} size='sm' variant="ghost">
                            <X className="h-5 w-5"/>
                        </Button>
                    </div>
                </form>
            </ListWrapper>
        )
    }
  return (
    <ListWrapper>
      <button
      onClick={enableEditing}
       className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm">
        <Plus className="h-4 w-4 mr-2"/>
        Add a list!
      </button>
    </ListWrapper>
  );
};
