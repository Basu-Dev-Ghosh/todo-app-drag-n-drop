"use client";
import { useBoardStore } from "@/store/BoardStore";
import React, { useEffect } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Column from "../Column/Column";
function Board() {
  const [board, getBoard, setBoardState, saveToDB] = useBoardStore((state) => [
    state.board,
    state.getBoard,
    state.setBoardState,
    state.saveToDB,
  ]);
  useEffect(() => {
    getBoard();
  }, [getBoard]);

  function handleOnDragEnd(result: DropResult) {
    const { destination, source, type } = result;
    if (!destination) return;

    // Handle Colummn drag
    if (type === "column") {
      const entries = Array.from(board.columns.entries());
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);
      const newColumns = new Map(entries);
      setBoardState({
        ...board,
        columns: newColumns,
      });
    }

    // Handle Card drag
    if (type === "card") {
      const columns = Array.from(board.columns);
      const startColumnIndex = columns[Number(source.droppableId)];
      const finishColumnIndex = columns[Number(destination.droppableId)];

      const startCol: Column = {
        id: startColumnIndex[0],
        todos: startColumnIndex[1].todos,
      };
      const finishCol: Column = {
        id: finishColumnIndex[0],
        todos: finishColumnIndex[1].todos,
      };

      if (!startCol || !finishCol) return;
      if (source.index === destination.index && startCol === finishCol) return;
      const newTodos = startCol.todos;
      const [movedTodo] = startCol.todos.splice(source.index, 1);

      if (startCol.id === finishCol.id) {
        newTodos.splice(destination.index, 0, movedTodo);
        const newCol = {
          id: startCol.id,
          todos: newTodos,
        };
        const newColumns = new Map(board.columns);
        newColumns.set(startCol.id, newCol);
        setBoardState({
          ...board,
          columns: newColumns,
        });
      } else {
        const newStartTodos = startCol.todos;
        const newFinishTodos = finishCol.todos;
        newFinishTodos.splice(destination.index, 0, movedTodo);
        const newStartCol = {
          id: startCol.id,
          todos: newStartTodos,
        };
        const newFinishCol = {
          id: finishCol.id,
          todos: newFinishTodos,
        };
        const newColumns = new Map(board.columns);
        newColumns.set(startCol.id, newStartCol);
        newColumns.set(finishCol.id, newFinishCol);
        saveToDB(movedTodo, finishCol.id);
        setBoardState({
          ...board,
          columns: newColumns,
        });
      }
    }
  }
  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId={"board"} direction="horizontal" type="column">
        {(provided) => (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => {
              return (
                <Column key={id} id={id} todos={column.todos} index={index} />
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Board;
