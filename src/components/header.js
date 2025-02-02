import Link from "next/link";
import Image from "next/image";

const Header = () => {
    return (
        <div id="content-wrapper" className="d-flex flex-column">

            <div id="content">
                <nav className="navbar navbar-expand navbar-light bg-white topbar static-top shadow">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item dropdown no-arrow">
                            <Link className="nav-NavLink dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <Image
                                    className="img-profile rounded-circle"
                                    src="/images/undraw_profile.svg"
                                    width={45}
                                    height={45}
                                    alt="Admin Profile"
                                    priority
                                />
                            </Link>
                            <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                                <Link className="dropdown-item" href="/logout">
                                    <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i> Logout
                                </Link>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Header;
