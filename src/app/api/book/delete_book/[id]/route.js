import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const { id } = await params;
    try {
        await pool.query("DELETE FROM books WHERE book_id = $1", [id]);

        return NextResponse.json({ message: 'Book deleted successfully.' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to Book teacher" }, { status: 500 });
    }
}