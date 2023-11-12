interface Board {
    columns:Map<typedColumn,Column>
}

interface Column {
    id:typedColumn,
    todos:Todo[]
}

type typedColumn='todo' | 'inprogress' | 'done';

interface Todo {
    $id:string,
    $createdAt:string,
    title:string,
    status:typedColumn,
    image?:Image
}
interface Image {
    bucketId:string,
    fileId:string
}