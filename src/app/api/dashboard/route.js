import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const students = await pool.query("SELECT COUNT(*) AS total_students FROM students");
        const teachers = await pool.query("SELECT COUNT(*) AS total_teachers FROM teachers");
        const books = await pool.query("SELECT COUNT(*) AS total_available_copies FROM books");

        return NextResponse.json({
            total_students: students.rows[0].total_students,
            total_teachers: teachers.rows[0].total_teachers,
            total_available_copies: books.rows[0].total_available_copies
        }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}