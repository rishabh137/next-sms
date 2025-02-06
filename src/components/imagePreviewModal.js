import { X } from "lucide-react";

const ImagePreviewModal = ({ isOpen, onClose, imageSrc, altText }) => {
    if (!isOpen) return null;

    return (
        <div
            className="image-preview-modal-overlay"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg p-4 relative max-w-2xl w-full mx-4" style={{ width: '20%' }}
                onClick={e => e.stopPropagation()}
            >
                <img
                    src={imageSrc}
                    alt={altText}
                    className="w-full h-auto rounded"
                />
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '24%',
                        right: '41%'
                    }}
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

export default ImagePreviewModal;
