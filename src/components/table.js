import Link from "next/link";
import { useState } from "react";
import ImagePreviewModal from "./imagePreviewModal";

const Table = ({ columns, data, handleSort, sortOrder, curr, idKey, openDeleteModal, openStatusModal }) => {
    const [previewImage, setPreviewImage] = useState({
        isOpen: false,
        src: "",
        alt: ""
    });

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', options);
        return formattedDate;
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const formattedTime = date.toLocaleTimeString('en-US', { hour12: true });
        return formattedTime;
    };

    const handleImageClick = (imageSrc, altText) => {
        setPreviewImage({
            isOpen: true,
            src: imageSrc,
            alt: altText
        });
    };

    const closeImagePreview = () => {
        setPreviewImage({
            isOpen: false,
            src: "",
            alt: ""
        });
    };

    return (
        <div className="relative">
            <ImagePreviewModal
                isOpen={previewImage.isOpen}
                onClose={closeImagePreview}
                imageSrc={previewImage.src}
                altText={previewImage.alt}
            />

            <table className="table table-bordered" width="100%" cellSpacing="0">
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                onClick={() => column.isSort ? handleSort(column.key) : null}
                                style={{ cursor: column.isSort ? "pointer" : "" }}
                            >
                                {column.name} {column.isSort && (
                                    <span>
                                        {column.key === curr?.order ?
                                            (curr?.type === "ASC" ? "↑" : "↓") :
                                            (sortOrder?.[column.key] === "ASC" ? "↑" : "↓")}
                                    </span>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((item, ind) => (
                            <tr key={ind}>
                                {columns.map((column, index) => (
                                    <td key={index} style={column.isImage ? { textAlign: 'center' } : {}}>
                                        {column.isImage ? (
                                            <div style={{ display: 'inline-block', textAlign: 'center', position: 'relative' }}>
                                                <img
                                                    className="img-profile rounded-circle hover:opacity-80 transition-opacity cursor-pointer"
                                                    src={item[column.imageKey] === null ? `/images/undraw_profile.svg` : `/uploads/${item[column.imageKey]}`}
                                                    alt={`${column.name} Image`}
                                                    style={{ width: '60px', height: '60px', display: 'block', margin: '0 auto', cursor: 'pointer' }}
                                                    onClick={() => handleImageClick(
                                                        item[column.imageKey] === null ? `/images/undraw_profile.svg` : `/uploads/${item[column.imageKey]}`,
                                                        `${column.name} Image`
                                                    )}
                                                />
                                                <span style={{ display: 'block', marginTop: '5px', fontSize: '14px', color: '#333' }}>
                                                    {item[column.key]}
                                                </span>
                                            </div>
                                        ) : column.isStatus ? (
                                            <span
                                                className={item[column.key] === 'Active' ? 'success' : 'danger'}
                                                style={{ cursor: "pointer" }}
                                                onClick={() => openStatusModal(item[idKey])}
                                            >
                                                {item[column.key]}
                                            </span>
                                        ) : column.isDate ? (
                                            <>
                                                {formatDate(item[column.key])} <br /> {formatTime(item[column.key])}
                                            </>
                                        ) : column.isBook ? (
                                            <>
                                                {formatDate(item[column.key])}
                                            </>
                                        ) : column.isAction ? (
                                            <>
                                                <button onClick={() => openDeleteModal(item[idKey])} style={{ marginRight: "5px" }}>
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                                <Link href={`/sms/${column.updatePath}/${item[idKey]}`}>
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </Link>
                                            </>
                                        ) : (
                                            item[column.key]
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} style={{ textAlign: 'center' }}>No records found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
