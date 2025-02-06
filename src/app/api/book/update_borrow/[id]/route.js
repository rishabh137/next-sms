import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
    try {

        const { id } = await params;
        const { subject, title, borrowDate, returnDate } = await req.json();

        let prevBook;
        const previousQuery = "SELECT book_id FROM borrow_log WHERE borrow_id = $1";
        const previousResult = await pool.query(previousQuery, [id]);
        if (previousResult.rows.length > 0) {
            prevBook = previousResult.rows[0].book_id;
        }

        const updateQuery = `
        UPDATE borrow_log
        SET subject_id = $1,
            book_id = $2,
            borrow_date = $3,
            return_date = $4,
            updated_on = CURRENT_TIMESTAMP
            WHERE borrow_id = $5
        `;
        await pool.query(updateQuery, [subject, title, borrowDate, returnDate, id]);

        await pool.query(`UPDATE books SET available_copies = available_copies + 1 
                              WHERE book_id = $1`, [prevBook]);

        await pool.query(`UPDATE books SET available_copies = available_copies - 1 
                      WHERE book_id = $1 AND available_copies > 0`, [title]);


        return NextResponse.json({ message: 'Borrow log updated successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server error' }, { status: 500 });
    }
}