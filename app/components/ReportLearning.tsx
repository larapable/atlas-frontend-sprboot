import React from 'react'

const ReportLearning = () => {
  return (
    <div>
        <div className="flex flex-row p-1 w-[85rem] h-auto">
          <img
            src="/learning.png"
            alt=""
            className=" h-[5rem] mb-5 mr-5 mt-[-0.6rem]"
          />
          <div className="flex flex-col">
            <span className="font-bold text-[1.3rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
              Learning & Growth Report Overview
            </span>
            <span className="font-regular text-[1rem] text-[rgb(59,59,59)] ml-[-0.5rem] break-words w-[97rem]">
                Each objective is categorized by semester, <span className="font-bold">select
                ( <span className='font-bold text-red-500'>1st</span> for FIRST SEMESTER, <span className='font-bold text-yellow-500'>2nd</span> for SECOND SEMESTER). </span> 
                Additionally, users must input the <span className="font-bold">actions taken, budget, person in charge,</span> and <span className="font-bold">opportunities for improvement (OFI).</span> 
            </span>
          </div>
        </div>
        <table className="w-full bg-[#fff6d1] text-[rgb(43,43,43)]">
        <thead>
            <tr>
            <th className="p-2 font-bold w-[8rem]">Semester</th>
            <th className="p-2 font-bold w-[10rem]">Target Code</th>
            <th className="p-2 font-bold w-[20rem]">Office Target</th>
            <th className="p-2 font-bold w-[15rem]">KPI</th>
            <th className="p-2 font-bold w-[10rem]">Budget</th>
            <th className="p-2 font-bold w-[15rem]">In-charge</th>
            <th className="p-2 font-bold w-[10rem]">Performance <br/> 
                <span className='font-medium'>
                    <span className='mr-10'>Actual</span>
                    <span>Target</span>
                </span>
            </th>
            <th className="p-2 font-bold">OFI</th>
            </tr>
        </thead>
        </table>
    </div>
  )
}

export default ReportLearning