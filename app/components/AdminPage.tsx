"use client";
import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import Navbar from "../components/Navbar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format, isSameDay } from "date-fns";
import "@/app/page.css";
//import RecentLogin from '@/models/recentlogin';

interface User {
  username: string;
  department: Department;
}

interface Department {
  department_name: string;
}
const COLORS = ["orange", "#dc2f02", "#8884d8", "#4B6FDD"]; // Define colors for the pie chart

const AdminPage = () => {
  const [totalFinancial, setTotalFinancial] = useState(0);
  const [totalStakeholders, setTotalStakeholders] = useState(0);
  const [totalInternalProcess, setTotalInternalProcess] = useState(0);
  const [totalLearningAndGrowth, setTotalLearningAndGrowth] = useState(0);

  const mappingData = [
    { name: "Financial", value: totalFinancial },
    { name: "Stakeholders", value: totalStakeholders },
    { name: "Internal Process", value: totalInternalProcess },
    { name: "Learning & Growth", value: totalLearningAndGrowth },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const responses = await Promise.all([
          fetch("http://localhost:8080/bsc/financialBscCount"),
          fetch("http://localhost:8080/bsc/stakeholderBscCount"),
          fetch("http://localhost:8080/bsc/internalBscCount"),
          fetch("http://localhost:8080/bsc/learningBscCount"),
        ]);
        const data = await Promise.all(
          responses.map((response) => response.json())
        );
        setTotalFinancial(data[0].count);
        setTotalStakeholders(data[1].count);
        setTotalInternalProcess(data[2].count);
        setTotalLearningAndGrowth(data[3].count);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const chartData = [
    { name: "Financial", value: totalFinancial },
    { name: "Stakeholders", value: totalStakeholders },
    { name: "Internal Process", value: totalInternalProcess },
    { name: "Learning & Growth", value: totalLearningAndGrowth },
  ];

  useEffect(() => {
    async function fetchReportData() {
      try {
        const response = await fetch("/api/reportCounts");
        if (response.ok) {
          const data = await response.json();
          setReportData([
            { name: "Financial", totalReports: data.financialReports },
            { name: "Stakeholders", totalReports: data.stakeholderReports },
            {
              name: "Internal Process",
              totalReports: data.internalProcessReports,
            },
            {
              name: "Learning & Growth",
              totalReports: data.learningAndGrowthReports,
            },
          ]);
        } else {
          console.error("Failed to fetch report data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    }

    fetchReportData();
  }, []);

  const [users, setUsers] = useState<User[]>([]); // Specify the type as User[]
  const [usersCount, setUsersCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8080/user/getAllUsers")
      .then((response) => response.json())
      .then((data: User[]) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  useEffect(() => {
    async function fetchCounts() {
      try {
        // Fetch department count
        const departmentResponse = await fetch(
          "http://localhost:8080/department/getDepartmentCount"
        );
        if (departmentResponse.ok) {
          const departmentData = await departmentResponse.json();
          setDepartmentCount(departmentData.departmentCount);
        } else {
          console.error(
            "Failed to fetch department count:",
            departmentResponse.statusText
          );
        }

        // Fetch user count
        const userResponse = await fetch(
          "http://localhost:8080/user/userCount"
        );
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUsersCount(userData.userCount);
        } else {
          console.error("Failed to fetch user count:", userResponse.statusText);
        }
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    }

    fetchCounts();
  }, []);
  // reports created for each perspectives
  // dummy values
  const [reportData, setReportData] = useState([
    { name: "Financial", totalReports: 0 },
    { name: "Stakeholders", totalReports: 0 },
    { name: "Internal Process", totalReports: 0 },
    { name: "Learning & Growth", totalReports: 0 },
  ]);

  // calendar
  const today = new Date();
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (isSameDay(date, today)) {
      return (
        <div
          style={{
            backgroundColor: "orange",
            color: "white",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {format(date, "d")}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-row">
      <Navbar />
      <div className="flex-1 flex flex-col mt-[-0.5rem] ml-[6.5rem] gap-20 mb-10">
        <div className="flex flex-row gap-5">
          <div className="bg-white h-[13rem] w-[63rem] shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.15)] rounded-lg">
            <p className="font-bold text-[2rem] mt-5 ml-5">Welcome, Admin</p>
            <div className="flex flex-row">
              <p className="text-[1.3rem] ml-5 mt-5 break-words">
                Use the Atlas Balance Scorecard system to effortlessly track and
                navigate your business success. Manage metrics, analyze
                performance, and achieve your strategic goals efficiently.
              </p>
              <img
                src="/welcomeadmin.png"
                alt=""
                className=" h-[13rem] w-[18rem] mt-[-4rem] ml-7"
              />
            </div>
          </div>
          <div className="bg-white h-[13rem] w-[16rem] shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.15)] rounded-lg">
            <div className="flex flex-col justify-center align-middle items-center">
              <img
                src="/departmenticon.png"
                alt=""
                className=" h-[3rem] w-[3.5rem] mt-8"
              />
              <p className="font-bold text-[2.5rem] mt-2 mb-[-0.5rem]">
                {departmentCount}
              </p>
              Departments
            </div>
          </div>
          <div className="bg-white h-[13rem] w-[16rem] shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.15)] rounded-lg">
            <div className="flex flex-col justify-center align-middle items-center">
              <img
                src="/usersicon.png"
                alt=""
                className=" h-[3rem] w-[3.5rem] mt-8"
              />
              <p className="font-bold text-[2.5rem] mt-2 mb-[-0.5rem]">
                {usersCount}
              </p>
              Users
            </div>
          </div>
        </div>
        <div className="mt-[-3rem] flex flex-row gap-5">
          <div className="flex flex-col ">
            <div className=" bg-white h-[27rem] w-[50rem] ml-[3rem] shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.15)] rounded-lg">
              <p className="font-bold text-[1.3rem] mt-5 ml-5">All Users</p>
              <div
                className="mt-5 ml-5 mr-5 overflow-y-auto"
                style={{ maxHeight: "25rem", overflowX: "hidden" }}
              >
                <table className="w-[50rem] ml-3">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-[#ED8316] text-left text-lg font-semibold text-white uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 bg-[#ED8316] text-left text-lg font-semibold text-white uppercase tracking-wider">
                        Department
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.department.department_name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-white h-[27rem] w-[40rem] shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.15)] rounded-lg">
            <Calendar className="react-calendar" />
          </div>

          <div className="ml-[-95.5rem] mt-[30rem] flex flex-row gap-5">
            <div className="bg-white h-[30rem] w-[97.5rem] shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.15)] rounded-lg">
              <p className="font-bold text-[1.3rem] mt-5 ml-5 mb-5">
                Mapping Strategies: Perspective Overview
              </p>
              <div className="ml-[-2rem]">
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={mappingData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mappingData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
