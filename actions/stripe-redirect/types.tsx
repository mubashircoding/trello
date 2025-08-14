import {z} from "zod"
import { Card } from "@prisma/client"
import { ActionState } from "@/lib/create-safe-actions"
import { StripeRedirect } from "./schema"

export type InputType = z.infer<typeof StripeRedirect>
export type ReturnType =  ActionState<InputType, string>