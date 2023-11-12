import { openai } from "@/openai";
import { NextResponse } from "next/server";

// *********** Currently not working for subscription issues ****************
export async function POST(request: Request) {
  const { todos } = await request.json();
  console.log(todos);

  const response = await openai.chat.completions.create({
    model: "text-embedding-ada-002",
    temperature: 0.8,
    n: 1,
    stream: false,
    messages: [
      {
        role: "system",
        content:
          "when responding welcome the user always as Mr.Basu and say welcome to your todo app!,Limit the response to 200 characters",
      },
      {
        role: "user",
        content: `Provide a summary of the following todos. Count how many todos in each categories such as To Do, in progress and done. Then tell user have a productive day and remind him to complete the todo ASAP. Here is the data: ${JSON.stringify(
          todos
        )}`,
      },
    ],
  });

  console.log("DATA", response);
  console.log("DATA Choice", response.choices[0].message);

  return NextResponse.json(response.choices[0].message);
}
