"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import LogoutModal from './logout';

const Header = () => {
    const router = useRouter();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = async () => {
        try {

            const response = await axios.post('/api/auth/logout');

            if (response.status === 200) {
                router.push("/");
                toast.success('Logout successful!');
            } else {
                const data = await response.json()
                throw new Error(data.error || "Unknown server error");
            }
        } catch (error) {
            throw new Error(error || "Unknown server error");
        }
    }

    const openLogoutModal = () => {
        setShowLogoutModal(true);
    };

    const closeLogoutModal = () => {
        setShowLogoutModal(false);
    };

    return (
        <div id="content-wrapper" className="d-flex flex-column">

            <LogoutModal
                showLogoutModal={showLogoutModal}
                closeLogoutModal={closeLogoutModal}
                handleLogout={handleLogout}
            />

            <div id="content">
                <nav className="navbar navbar-expand navbar-light bg-white topbar static-top shadow">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item dropdown no-arrow">
                            <Link className="nav-Link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img className="img-profile rounded-circle" style={{ width: "35px" }} src="/images/undraw_profile.svg" alt="Admin Profile" />
                            </Link>
                            <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" style={{ marginTop: '1.2rem' }} aria-labelledby="userDropdown">
                                <span className="dropdown-item" style={{ cursor: "pointer" }} onClick={openLogoutModal}>
                                    <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i> Logout
                                </span>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Header;
