"use client";
import { redirect } from "next/navigation";

const SearchBtnNavigation = () => {

  return (
    <button 
      className="rounded-md px-3 py-2 text-left hover:bg-black/5"
      onClick={() => redirect("/mobc/search")}
    >
      Search albums
    </button>
  );
}

export default SearchBtnNavigation;