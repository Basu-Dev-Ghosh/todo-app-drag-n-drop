import { ID, database, storage } from "@/appwrite";
import { getTodosGroupedByColumn } from "@/lib/getTodos";
import { uploadImage } from "@/lib/uploadImage";
import { create } from "zustand";

interface BoardState {
  board: Board;
  addTask: (todo: string, columnId: typedColumn, image: File | null) => void;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  saveToDB: (todo: Todo, status: typedColumn) => void;
  searchTerm: string;
  setSearchTerm: (text: string) => void;
  deleteTodo: (todoIndex: number, todo: Todo, id: typedColumn) => void;
  newTaskInput: string;
  setNewTaskInput: (text: string) => void;
  newTaskType: typedColumn;
  setNewTaskType: (type: typedColumn) => void;
  image: File | null;
  setImage: (image: File | null) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<typedColumn, Column>(),
  },
  addTask: async (todo: string, columnId: typedColumn, image: File | null) => {
    let file: Image | undefined;
    if (image) {
      const fileUploaded = await uploadImage(image);
      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };
      }
    }
    await database.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        ...(file && { image: JSON.stringify(file) }),
      }
    );

    set({ newTaskInput: "" });

    set((state) => {
      const newColumns = new Map(state.board.columns);
      const newTodo: Todo = {
        $id: ID.unique(),
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        ...(file && { image: file }),
      };

      const column = newColumns.get(columnId);
      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }
      return { board: { columns: newColumns } };
    });
  },

  searchTerm: "",
  setSearchTerm: (text: string) => {
    set({ searchTerm: text });
  },
  getBoard: async () => {
    const board: Board = await getTodosGroupedByColumn();
    set({ board });
  },
  setBoardState: (board: Board) => {
    set({ board });
  },
  saveToDB: async (todo: Todo, status: typedColumn) => {
    await database.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        status,
      }
    );
  },
  deleteTodo: async (todoIndex: number, todo: Todo, id: typedColumn) => {
    const newColumns = new Map(get().board.columns);
    newColumns.get(id)?.todos.splice(todoIndex, 1);
    set({ board: { columns: newColumns } });

    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
    }
    await database.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
    );
  },
  newTaskInput: "",
  setNewTaskInput: (text: string) => {
    set({ newTaskInput: text });
  },
  newTaskType: "todo",
  setNewTaskType: (type: typedColumn) => {
    set({ newTaskType: type });
  },
  image: null,
  setImage: (image: File | null) => {
    set({ image });
  },
}));
