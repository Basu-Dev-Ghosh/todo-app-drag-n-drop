export async function fetchSuggestionFromGPT(board: Board) {
  const todos = formatTodos(board);
  const res = await fetch("/api/generateSummary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ todos }),
  });

  const data = await res.json();
  console.log(data);
  return "";
}

function formatTodos(board: Board) {
  // Not Completed yet
  const todos = Array.from(board.columns.values()).flatMap(
    (column) => column.todos
  );
  const formatedTodos = todos.map((todo) => todo.title).join("\n");
  console.log(formatedTodos);
}
