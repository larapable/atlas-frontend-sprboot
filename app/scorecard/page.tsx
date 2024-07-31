"use client";
import Navbar from "../components/Navbar";
import React, { useState, useEffect } from "react";
import Financial from "../components/Financial";
import Learning from "../components/Learning";
import Stakeholder from "../components/Stakeholder";
import Internal from "../components/Internal";

const ScorecardPage = () => {
  const [selectedComponent, setSelectedComponent] = useState("");

  const changeComponent = (componentName: string) => {
    localStorage.setItem("lastComponent", componentName);
    setSelectedComponent(componentName);
  };

  useEffect(() => {
    const lastComponent = localStorage.getItem("lastComponent");
    if (lastComponent) {
      setSelectedComponent(lastComponent);
    }
  }, []);

  return (
    <div className="flex flex-row w-full h-screen">
      <Navbar />
      <div className="flex-1 flex flex-col mt-8 ml-80">
        <div className="flex flex-row">
          <div className="mb-5 mt-[0rem] inline-block break-words font-bold text-[3rem] text-[rgb(59,59,59)]">
            BALANCE SCORECARD
          </div>

          {/* perspectives toggle */}
          <div className="flex justify-center ml-[20rem] mt-[0.5rem] border border-gray-200 bg-gray w-[44rem] h-[4rem] rounded-xl px-1 py-1">
            <div
              className="flex flex-row box-sizing-border mr-2 cursor-pointer"
              onClick={() => changeComponent("Financial")}
            >
              <div
                className={`inline-block break-words font-bold transition-all rounded-lg px-4 py-3 ${
                  selectedComponent === "Financial"
                    ? "bg-[#A43214] text-white"
                    : "border text-[#A43214]"
                } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white`}
              >
                FINANCIAL
              </div>
            </div>
            <div
              className="flex flex-row box-sizing-border mr-2 cursor-pointer"
              onClick={() => changeComponent("Stakeholder")}
            >
              <div
                className={`inline-block break-words font-bold transition-all rounded-lg px-4 py-3 ${
                  selectedComponent === "Stakeholder"
                    ? "bg-[#A43214] text-white"
                    : "border text-[#A43214]"
                } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white`}
              >
                STAKEHOLDER
              </div>
            </div>
            <div
              className="flex flex-row box-sizing-border mr-2 cursor-pointer"
              onClick={() => changeComponent("Internal")}
            >
              <div
                className={`inline-block break-words font-bold transition-all rounded-lg px-4 py-3 ${
                  selectedComponent === "Internal"
                    ? "bg-[#A43214] text-white"
                    : "border text-[#A43214]"
                } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white`}
              >
                INTERNAL PROCESS
              </div>
            </div>
            <div
              className="flex flex-row box-sizing-border cursor-pointer"
              onClick={() => changeComponent("Learning")}
            >
              <div
                className={`inline-block break-words font-bold transition-all rounded-lg px-4 py-3 ${
                  selectedComponent === "Learning"
                    ? "bg-[#A43214] text-white"
                    : "border text-[#A43214]"
                } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white`}
              >
                LEARNING & GROWTH
              </div>
            </div>
          </div>
          {/* end of perspectives toggle */}
        </div>

        <div className="break-words font font-normal text-[1.3rem] text-[#504C4C] mb-10">
          Explore the Balanced Scorecard feature to gain a comprehensive view of
          your organization&apos;s performance across different dimensions. Use
          it to set clear objectives, track progress, and drive strategic
          initiatives for success.
        </div>

        <div className="shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] border border-gray-300 bg-[#FFFFFF] relative mr-10 flex flex-col pt-4 pr-5 pl-5 w-[98%] h-auto mb-10 rounded-lg pb-5">
          {selectedComponent === "Financial" && <Financial />}
          {selectedComponent === "Stakeholder" && <Stakeholder />}
          {selectedComponent === "Internal" && <Internal />}
          {selectedComponent === "Learning" && <Learning />}
        </div>
      </div>
    </div>
  );
};

export default ScorecardPage;
