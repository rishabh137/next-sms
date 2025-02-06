import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const { id } = await params;

    try {
        const query = `
            SELECT t.*, s.*
            FROM teachers t
            JOIN subject s ON t.subject_id = s.subject_id
            WHERE teacher_id = $1
        `;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
        }

        const teacher = result.rows[0];
        return NextResponse.json({ teacher }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch teacher" }, { status: 500 });
    }
};
