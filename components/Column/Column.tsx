import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import TodoCard from "../TodoCard/TodoCard";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { useBoardStore } from "@/store/BoardStore";
import { useModalStore } from "@/store/ModalStore";

type props = {
  id: typedColumn;
  todos: Todo[];
  index: number;
};

const idToColumnText: {
  [key in typedColumn]: string;
} = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
};

function Column({ id, todos, index }: props) {
  const [searchTerm, setNewTaskType] = useBoardStore((state) => [
    state.searchTerm,
    state.setNewTaskType,
  ]);
  const [openModal] = useModalStore((state) => [state.openModal]);
  return (
    <Draggable key={id} draggableId={id} index={index}>
      {(provided) => (
        <div
          className="p-4"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Droppable droppableId={index.toString()} type="card">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`pb-1 px-2 rounded-2xl shadow-sm ${
                  snapshot.isDraggingOver ? "bg-[#bbc582]/10" : "bg-white/50"
                }`}
              >
                <h2 className="flex justify-between font-semibold text-xl p-2">
                  {idToColumnText[id]}{" "}
                  <span className="text-gray-500 bg-gray-100 rounded-full px-2 py-1 text-sm font-normal">
                    {!searchTerm
                      ? todos.length
                      : todos.filter((todo) =>
                          todo.title
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        ).length}
                  </span>
                </h2>
                <div className="space-y-2">
                  {todos.map((todo, index) => {
                    if (
                      searchTerm &&
                      !todo.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                      return null;
                    return (
                      <Draggable
                        key={todo.$id}
                        draggableId={todo.$id}
                        index={index}
                      >
                        {(provided) => (
                          <TodoCard
                            todo={todo}
                            index={index}
                            id={id}
                            innerRef={provided.innerRef}
                            draggableProps={provided.draggableProps}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                  <div className="flex items-end justify-end p-2">
                    <button
                      className="text-green-500 hover:text-green-600"
                      onClick={() => {
                        setNewTaskType(id);
                        openModal();
                      }}
                    >
                      <PlusCircleIcon className="h-10 w-10 " />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}

export default Column;
