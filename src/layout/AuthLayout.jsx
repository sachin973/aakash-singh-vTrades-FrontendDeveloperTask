import React, { useEffect } from "react";
import AuthImg from "../asset/img/authimg.png";





const AuthLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-black lg:p-8 ">
            {/* Left side - Image with overlay text */}
            <div className="relative hidden lg:block lg:w-1/2">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <img
                    src={AuthImg}
                    alt="Team collaboration"
                    className="h-full w-full object-cover rounded-[15px]"
                />
                <div className="absolute bottom-0 left-0 p-8 text-white">
                    <h1 className="text-3xl font-bold mb-6">Welcome to WORKHIVE!</h1>
                    <ul className="space-y-2">
                        <li className="flex items-center">
                            <span className="mr-2">•</span>
                            <span>Employee Management: View detailed profiles, track performance, and manage attendance.</span>
                        </li>
                        <li className="flex items-center">
                            <span className="mr-2">•</span>
                            <span>Performance Insights: Analyze team goals, progress, and achievements.</span>
                        </li>
                        <li className="flex items-center">
                            <span className="mr-2">•</span>
                            <span>Attendance & Leaves: Track attendance patterns and manage leave requests effortlessly.</span>
                        </li>
                    </ul>
                </div>
            </div>
      //   {/* Right side - Sign In Form */}
            <div  className="w-full lg:w-1/2 flex items-center justify-center p-8" >{children}</div>

        </div>
    );
};



export default AuthLayout;
