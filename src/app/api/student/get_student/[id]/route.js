import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const { id } = await params;

    try {
        const query = `
            SELECT s.*, c.*
            FROM students s
            JOIN courses c ON s.course_id = c.course_id
            WHERE student_id = $1
        `;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

        const student = result.rows[0];
        return NextResponse.json({ student }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 });
    }
};
