"use client";
import Navbar from "../../components/Navbar";
import EditProfileUsers from "../../components/EditProfileUsers";
import React from 'react'

export default function ProfileForUsers() {
    return (
      <div className="flex flex-row w-full h-screen">
        <div className="flex">
          <Navbar />
        </div>
        <div className="flex-1">
          <div className="flex-1 flex flex-col mt-3 ml-80">
            <EditProfileUsers />
          </div>
        </div>
      </div>
    );
  }