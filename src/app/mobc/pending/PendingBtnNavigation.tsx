"use client";
import { redirect } from "next/navigation"; 

const PendingBtnNavigation = () => {
  return (
    <button 
      className="rounded-md px-3 py-2 text-left hover:bg-black/5"
      onClick={() => redirect("/mobc/pending")}
    >
      Pending albums
    </button>
  );
}

export default PendingBtnNavigation;