"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
    const [summary, setSummary] = useState({
        total_students: 0,
        total_teachers: 0,
        total_available_copies: 0
    });

    useEffect(() => {
        axios.get("/api/dashboard")
            .then(res => setSummary(res.data))
            .catch(() => console.error("Failed to fetch data"));
    }, []);

    useEffect(()=>{
        document.title = "Dashboard";
    }, [])

    return (

        // <div 
        //     id="content-wrapper" 
        //     style={{
        //         display: 'flex', 
        //         flexDirection: 'column', 
        //         height: '100vh',
        //         overflow: 'hidden'
        //     }}
        // >

        //     <div 
        //         id="content" 
        //         style={{
        //             flex: '1',
        //             overflowY: 'auto'
        //         }}
        //     >
        //         <div className="container-fluid"></div>
        <div id="content-wrapper" className="d-flex flex-column" style={{ marginBottom: "19rem" }}>

            <div id="content">
                <div className="container-fluid">

                    <h1 className="h3 mb-4 mt-3 text-gray-800">Student Management System</h1>

                    <div className="row">
                        <div className="col-xl-4 col-md-6 mb-4">
                            <div className="card border-left-primary shadow h-100 py-2">
                                <div className="card-body">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col mr-2">
                                            <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                Total Students</div>
                                            <div className="h5 mb-0 font-weight-bold text-gray-800">{summary.total_students}</div>
                                        </div>
                                        <div className="col-auto">
                                            <i className="fas fa-user-graduate fa-2x text-gray-300"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-4 col-md-6 mb-4">
                            <div className="card border-left-info shadow h-100 py-2">
                                <div className="card-body">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col mr-2">
                                            <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Total Teachers</div>
                                            <div className="h5 mb-0 font-weight-bold text-gray-800">{summary.total_teachers}</div>
                                        </div>
                                        <div className="col-auto">
                                            <i className="fas fa-chalkboard-teacher fa-2x text-gray-300"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-4 col-md-6 mb-4">
                            <div className="card border-left-primary shadow h-100 py-2">
                                <div className="card-body">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col mr-2">
                                            <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Total Books</div>
                                            <div className="h5 mb-0 font-weight-bold text-gray-800">{summary.total_available_copies}</div>
                                        </div>
                                        <div className="col-auto">
                                            <i className="fa-solid fa-book fa-2x text-gray-300"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>


                </div>


            </div>
        </div>
    );
};

export default Dashboard;
