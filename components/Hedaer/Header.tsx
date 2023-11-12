"use client";
import React, { useState, useEffect } from "react";
import {
  CodeBracketIcon,
  MagnifyingGlassIcon,
  Cog8ToothIcon,
} from "@heroicons/react/24/solid";
import { useBoardStore } from "@/store/BoardStore";
import { fetchSuggestionFromGPT } from "@/lib/fetchSuggestion";

function Header() {
  const [setSearchTerm, board] = useBoardStore((state) => [
    state.setSearchTerm,
    state.board,
  ]);
  // const [loading, setLoading] = useState<Boolean>(true);
  // const [suggestion, setSuggestion] = useState<string>("");

  useEffect(() => {
    // *********** Currently not working for subscription issues ****************
    // if (board.columns.size === 0) return;
    // const fetchSugestion = async () => {
    //   const result = await fetchSuggestionFromGPT(board);
    //   setSuggestion(result);
    // };
    // fetchSugestion();
  }, [board]);

  return (
    <header>
      <div className="flex flex-col  md:flex-row items-center p-4 bg-green-100/10">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-[#72ff5c] to-[#14db49] rounded-md filter blur-3xl opacity-50 -z-10" />
        {/* logo */}
        <div className="flex p-2 md:p-0 text-xl items-center space-x-1">
          <CodeBracketIcon className="w-6 h-6" />
          <span className=" font-bold">TODO.DEV</span>
        </div>

        {/* Search bar */}
        <div className="flex flex-1  justify-end w-full">
          <form className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial">
            <MagnifyingGlassIcon className="w-6 h-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="flex-1 outline-none p-1"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" hidden>
              search
            </button>
          </form>
        </div>
      </div>
      {/*
        <div className="flex items-center justify-center mt-2">
        <p className="bg-white shadow-2xl max-w-3xl flex items-center rounded-lg p-4">
          <Cog8ToothIcon className="w-6 h-6 mx-2" />
          GPT is ready to be used
        </p>
      </div>
        
        */}
    </header>
  );
}

export default Header;
