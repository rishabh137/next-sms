import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { subject } = await req.json();

    try {
        const query = 'SELECT book_id, name, author FROM books WHERE subject_id = $1 AND status = $2 AND available_copies > 0 ORDER BY name';

        const result = await pool.query(query, [subject, 'Active']);
        if (result.rows.length == 0) {
            return NextResponse.json({ error: "No Books found." }, { status: 400 });
        }

        const books = result.rows;

        return NextResponse.json({ books }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}