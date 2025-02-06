import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
    const { id } = await params;
    try {
        await pool.query(
            "UPDATE books SET status = CASE WHEN status = 'Active'::status_enum THEN 'Inactive'::status_enum ELSE 'Active'::status_enum END WHERE book_id = $1",
            [id]
        );
        return NextResponse.json({ message: "Status changed successfully!" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to change status." }, { status: 500 });
    }
}