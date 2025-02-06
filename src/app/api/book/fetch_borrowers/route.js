import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { type } = await req.json();
    console.log(type);

    try {
        let query;
        if (type === 'student') {
            query = 'SELECT student_id AS id, name FROM students ORDER BY name';
        } else {
            query = 'SELECT teacher_id AS id, name FROM teachers ORDER BY name';
        }

        let result = await pool.query(query);
        if (result.rows.length === 0) {
            return NextResponse.json({ error: "No records found." }, { statusy: 400 });
        }
        const borrowers = result.rows;

        return NextResponse.json({ borrowers }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}