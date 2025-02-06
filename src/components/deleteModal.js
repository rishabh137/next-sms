import React, { useEffect, useState } from 'react';

const DeleteModal = ({ pageName, showDeleteModal, closeDeleteModal, deleteFunction, id, returnVal }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (showDeleteModal) {
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
    }, [showDeleteModal]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(closeDeleteModal, 10);
    };

    const handleDelete = () => {
        setIsVisible(false);
        setTimeout(() => deleteFunction(id), 10);
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
                aria-labelledby="deleteModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="deleteModalLabel">Ready to {returnVal ? returnVal : 'Delete'}?</h5>
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
                            Select {returnVal ? returnVal : "Delete"} below if you want to {returnVal ? returnVal.toLowerCase() : "delete"} this {pageName}.
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
                                onClick={handleDelete}
                            >
                                {returnVal ? returnVal : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DeleteModal;