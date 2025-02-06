import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
    try {

        const { id } = await params;
        const { name, subject, author, status, isbn, copies } = await req.json();

        if (!name || !subject || !author || !status || !isbn || !copies) {
            return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
        }

        const isbnCheckQuery = 'SELECT * FROM books WHERE isbn = $1 AND book_id != $2';
        const isbnCheckResult = await pool.query(isbnCheckQuery, [isbn, id]);

        if (isbnCheckResult.rows.length > 0) {
            return NextResponse.json({ error: "ISBN already exist for another book." }, { status: 400 });
        }

        const updateQuery = `
            UPDATE books 
            SET name = $1, subject_id = $2,
                author = $3, isbn = $4, available_copies = $5, status = $6, updated_on = CURRENT_TIMESTAMP
            WHERE book_id = $7
        `;

        await pool.query(updateQuery, [
            name, subject, author,
            isbn, copies, status, id
        ]);

        return NextResponse.json({ message: 'Book updated successfully.' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
    }
}