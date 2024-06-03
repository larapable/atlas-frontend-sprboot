"use client";
import Navbar from "../components/Navbar";
import Inputgoals from "../components/Inputgoals";

export default function InputGoalsPage() {
  return (
    <div className="flex flex-row">
      <Navbar />
      <div className="flex-1 flex flex-col mt-8 ml-56">
        <Inputgoals />
      </div>
    </div>
  );
}
