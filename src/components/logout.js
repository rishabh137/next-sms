import { useEffect, useState } from 'react';

const LogoutModal = ({ showLogoutModal, closeLogoutModal, handleLogout }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (showLogoutModal) {
            setShouldRender(true);
            const timer = setTimeout(() => setIsVisible(true), 100);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
            const timer = setTimeout(() => setShouldRender(false), 10);
            return () => clearTimeout(timer);
        }
    }, [showLogoutModal]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(closeLogoutModal, 10);
    };

    const handleConfirmLogout = () => {
        setIsVisible(false);
        setTimeout(handleLogout, 10);
    };

    if (!shouldRender) return null;

    return (
        <>
            <div className="modal-overlay" />
            <div className={`modal fade ${isVisible ? 'show' : ''}`} tabIndex="-1" style={{ display: "block" }} aria-modal="true" role="dialog" aria-labelledby="logoutModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="logoutModalLabel">Ready to Logout?</h5>
                            <button className="close" type="button" data-dismiss="modal" onClick={handleClose} aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">Select "Logout" below if you want to logout from the application.</div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" type="button" onClick={handleClose}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleConfirmLogout}>Logout</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LogoutModal;
