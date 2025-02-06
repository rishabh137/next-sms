"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
    const [openSection, setOpenSection] = useState('');
    const pathname = usePathname();

    useEffect(() => {
        if (pathname.includes('student')) {
            setOpenSection('student');
        } else if (pathname.includes('teacher')) {
            setOpenSection('teacher');
        } else if (pathname.includes('book') || pathname.includes('borrow')) {
            setOpenSection('library');
        }
    }, [pathname]);

    const toggleSection = (section) => {
        if (openSection === section) {
            setOpenSection('');
        } else {
            setOpenSection(section);
        }
    };

    const isActive = (path) => pathname === path ? 'active' : '';

    return (
        <div id="wrapper">
            <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion">
                <Link className="sidebar-brand d-flex align-items-center justify-content-center" href="/sms">
                    <div className="sidebar-brand-icon rotate-n-15">
                        <i className="fas fa-laugh-wink"></i>
                    </div>
                    <div className="sidebar-brand-text mx-3">SMS Admin</div>
                </Link>

                <hr className="sidebar-divider my-0" />
                <hr className="sidebar-divider" />
                <div className="sidebar-heading">Interface</div>

                <li className="nav-item">
                    <div
                        className={`nav-link ${openSection === 'student' ? '' : 'collapsed'}`}
                        onClick={() => toggleSection('student')}
                        style={{ cursor: 'pointer' }}
                        data-toggle="collapse"
                        aria-expanded={openSection === 'student'}
                    >
                        <i className="fas fa-fw fa-folder"></i>
                        <span>Student</span>
                    </div>
                    <div
                        id="student"
                        className={`collapse ${openSection === 'student' ? 'show' : ''}`}
                    >
                        <div className="bg-white py-2 collapse-inner rounded">
                            <Link className={`collapse-item ${isActive('/sms/add_student')}`} href="/sms/add_student">Add Student</Link>
                            <Link className={`collapse-item ${isActive('/sms/list_student')}`} href="/sms/list_student">List Students</Link>
                        </div>
                    </div>
                </li>

                <li className="nav-item">
                    <div
                        className={`nav-link ${openSection === 'teacher' ? '' : 'collapsed'}`}
                        onClick={() => toggleSection('teacher')}
                        style={{ cursor: 'pointer' }}
                        data-toggle="collapse"
                        aria-expanded={openSection === 'teacher'}
                    >
                        <i className="fas fa-fw fa-folder"></i>
                        <span>Teacher</span>
                    </div>
                    <div
                        id="teacher"
                        className={`collapse ${openSection === 'teacher' ? 'show' : ''}`}
                    >
                        <div className="bg-white py-2 collapse-inner rounded">
                            <Link className={`collapse-item ${isActive('/sms/add_teacher')}`} href="/sms/add_teacher">Add Teacher</Link>
                            <Link className={`collapse-item ${isActive('/sms/list_teacher')}`} href="/sms/list_teacher">List Teachers</Link>
                        </div>
                    </div>
                </li>

                <li className="nav-item">
                    <div
                        className={`nav-link ${openSection === 'library' ? '' : 'collapsed'}`}
                        onClick={() => toggleSection('library')}
                        style={{ cursor: 'pointer' }}
                        data-toggle="collapse"
                        aria-expanded={openSection === 'library'}
                    >
                        <i className="fas fa-fw fa-folder"></i>
                        <span>Library</span>
                    </div>
                    <div
                        id="library"
                        className={`collapse ${openSection === 'library' ? 'show' : ''}`}
                    >
                        <div className="bg-white py-2 collapse-inner rounded">
                            <Link className={`collapse-item ${isActive('/sms/add_book')}`} href="/sms/add_book">Add Book</Link>
                            <Link className={`collapse-item ${isActive('/sms/list_book')}`} href="/sms/list_book">List Books</Link>
                            <Link className={`collapse-item ${isActive('/sms/borrow_book')}`} href="/sms/borrow_book">Borrow Books</Link>
                            <Link className={`collapse-item ${isActive('/sms/borrow_log')}`} href="/sms/borrow_log">Borrow log</Link>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
