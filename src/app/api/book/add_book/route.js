import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { name, subject, author, status, isbn, copies } = await req.json();

        if (!name || !subject || !author || !status || !isbn || !copies) {
            return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
        }

        let query = "SELECT * FROM books WHERE isbn = $1";
        let result = await pool.query(query, [isbn]);
        if (result.rows.length > 0) {
            return NextResponse.json({ error: "ISBN already exists." }, { status: 400 });
        }

        query = "INSERT INTO books (name, subject_id, author, isbn, available_copies, status) VALUES ($1, $2, $3, $4, $5, $6);"
        const values = [name, subject, author, isbn, copies, status];
        await pool.query(query, values);

        return NextResponse.json({ message: 'Book added successfully.' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
    }
}