import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { subject, borrowId } = await req.json();

    try {

        const query = 'SELECT book_id, name, author FROM books WHERE subject_id = $1 AND status = $2 ORDER BY name';
        const bookQuery = 'SELECT book_id from borrow_log WHERE borrow_id = $1'

        const result = await pool.query(query, [subject, 'Active']);
        if (result.rows.length == 0) {
            return NextResponse.json({ error: "No Books found." }, { status: 400 });
        }

        const resultBookId = await pool.query(bookQuery, [borrowId]);

        const books = result.rows;
        const bookId = resultBookId.rows;


        return NextResponse.json({ books, bookId }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}