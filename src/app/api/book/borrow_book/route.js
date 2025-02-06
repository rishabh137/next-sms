import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { name, subject, title, borrowDate, returnDate, borrowerType } = await req.json();

    try {
        let query = 'SELECT * FROM borrow_log WHERE borrower_id = $1 AND borrower_type = $2 AND book_id = $3';
        let result = await pool.query(query, [name, borrowerType, title]);

        if (result.rows.length > 0) {
            return NextResponse.json({ error: `This ${borrowerType} has already borrowed this book.` }, { status: 400 });
        }

        query = 'INSERT INTO borrow_log (borrower_id, subject_id, borrower_type, book_id, borrow_date, return_date) VALUES ($1, $2, $3, $4, $5, $6)';
        await pool.query(query, [name, subject, borrowerType, title, borrowDate, returnDate]);

        const updateQuery = "UPDATE books SET available_copies = available_copies - 1 WHERE book_id = $1 AND available_copies > 0";
        await pool.query(updateQuery, [title]);

        return NextResponse.json({ message: "Book borrowed Successfully!" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}