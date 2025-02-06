import { useEffect, useState } from 'react';

const StatusModal = ({ showStatusModal, closeStatusModal, statusFunction, id }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (showStatusModal) {
            setShouldRender(true);
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 10);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 10);
            return () => clearTimeout(timer);
        }
    }, [showStatusModal]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(closeStatusModal, 10);
    };

    const handleUpdate = () => {
        setIsVisible(false);
        setTimeout(() => statusFunction(id), 10);
    };

    if (!shouldRender) return null;

    return (
        <>
            <div
                className="modal-overlay"
            />
            <div
                className={`modal fade ${isVisible ? 'show' : ''}`}
                tabIndex="-1"
                style={{ display: "block" }}
                aria-modal="true"
                role="dialog"
                aria-labelledby="statusModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="statusModalLabel">Ready to Update?</h5>
                            <button
                                className="close"
                                type="button"
                                data-dismiss="modal"
                                onClick={handleClose}
                                aria-label="Close"
                            >
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            Select "Update" below if you want to update the status.
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                type="button"
                                onClick={handleClose}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleUpdate}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default StatusModal;