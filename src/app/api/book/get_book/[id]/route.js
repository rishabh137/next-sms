import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const { id } = await params;

    try {
        const query = `
            SELECT b.*, s.*
            FROM books b
            JOIN subject s ON b.subject_id = s.subject_id
            WHERE book_id = $1
        `;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return NextResponse.json({ error: "Book not found" }, { status: 404 });
        }

        const book = result.rows[0];
        return NextResponse.json({ book }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch book" }, { status: 500 });
    }
}