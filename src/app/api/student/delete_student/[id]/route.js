import pool from "@/lib/db";
import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

export async function GET(req, { params }) {
    const { id } = await params;
    try {
        const query = 'SELECT image FROM students WHERE student_id = $1';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return NextResponse.json({ message: 'Student not found' }, { status: 404 });
        }

        const imagePath = result.rows[0].image;

        await pool.query("DELETE FROM students WHERE student_id = $1", [id]);

        if (imagePath) {
            const fullPath = path.join('public/uploads', imagePath);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        }

        return NextResponse.json({ message: 'Student deleted successfully.' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to delete student' }, { status: 500 });
    }
}