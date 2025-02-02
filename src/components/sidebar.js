import Link from 'next/link';

const Sidebar = ({ currentPage }) => {
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
                    <Link className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#student" aria-expanded="true">
                        <i className="fas fa-fw fa-folder"></i>
                        <span>Student</span>
                    </Link>
                    <div id="student" className={`collapse ${currentPage === 'add_student' || currentPage === 'list_student' ? 'show' : ''}`}>
                        <div className="bg-white py-2 collapse-inner rounded">
                            <Link className={`collapse-item ${currentPage === 'add_student' ? 'active' : ''}`} href="/sms/add_student">Add Student</Link>
                            <Link className={`collapse-item ${currentPage === 'list_student' ? 'active' : ''}`} href="/sms/list_student">List Students</Link>
                        </div>
                    </div>
                </li>

            </ul>
        </div>
    );
};

export default Sidebar;
