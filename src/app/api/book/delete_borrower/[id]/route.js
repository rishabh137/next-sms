import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const { id } = await params;
    try {
        let book;
        const query = "SELECT book_id FROM borrow_log WHERE borrow_id = $1";
        const result = await pool.query(query, [id]);

        if (result.rows.length > 0) {
            book = result.rows[0].book_id;
        }

        await pool.query("UPDATE books SET available_copies = available_copies + 1 WHERE book_id = $1", [book]);
        await pool.query("DELETE FROM borrow_log WHERE borrow_id = $1", [id]);

        return NextResponse.json({ message: 'Book returned successfully.' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to return book" }, { status: 500 });
    }
}