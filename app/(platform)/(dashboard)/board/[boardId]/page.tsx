import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ListContainer from "./_components/list-container";

interface BoardIDPageProps {
  params: {
    boardId: string;
  };
}

const BoardIdPage = async ({ params }: BoardIDPageProps) => {
  const { orgId } = auth();

  if (!orgId) {
    redirect("/select-org");
  }

  const lists = await db.list.findMany({
    where: {
      boardId: params.boardId,
      board: {
        orgId,
      },
    },
    include: {
      cards: {
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: {
        order: "asc",
      },    
  });
  return <div className="p-4 h-full overflow-x-auto">
    <ListContainer
    boardId={params.boardId}
    data={lists}
    />
  </div>;
};

export default BoardIdPage;
