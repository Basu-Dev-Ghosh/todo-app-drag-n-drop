import { database } from "@/appwrite"

export async function getTodosGroupedByColumn() {
        const data = await database.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID!,process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!)
        const todos=data.documents;

        // Resetting the todos in columns manner

        const columns=todos.reduce((acc,todo)=>{
                if(!acc.has(todo.status)){
                        acc.set(todo.status,{
                                id:todo.status,
                                todos:[]
                        })
                }

                acc.get(todo.status)!.todos.push({
                        $id:todo.$id,
                        $createdAt:todo.$createdAt,
                        title:todo.title,
                        status:todo.status,
                        ...(todo.image && {image : JSON.parse(todo.image)}),
                })
                return acc;
        },new Map<typedColumn,Column>())


        // If there is any one status has no todos 

        const todoTypes:typedColumn[]=['todo','inprogress','done'];
        todoTypes.forEach((type)=>{
                if(!columns.has(type)){
                        columns.set(type,{
                                id:type,
                                todos:[]
                        })
                }
        })


        // Sorting the columns
        
        const sortedColumns =new Map(
                Array.from(columns.entries()).sort(
                (a,b)=>todoTypes.indexOf(a[0])-todoTypes.indexOf(b[0]) 
                ));


        const board:Board={
                columns:sortedColumns
        }

        return board;
}