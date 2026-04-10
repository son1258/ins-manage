"use client"

import Navbar from "@/components/NavBar";
import SideBar from "@/components/SideBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-gray-100">
            <SideBar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 pt-4">
                    {children}
                </main>
            </div>
        </div>
    )
}