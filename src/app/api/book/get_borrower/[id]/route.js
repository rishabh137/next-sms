import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { id } = await params;

        const query = `SELECT bl.borrow_id, bl.book_id, bl.borrower_type, bl.subject_id, sb.subject_name,
                   CASE bl.borrower_type 
                       WHEN 'student' THEN s.name 
                       WHEN 'teacher' THEN t.name 
                   END AS name, 
                   CASE bl.borrower_type 
                       WHEN 'student' THEN s.image 
                       WHEN 'teacher' THEN t.image 
                   END AS image, 
                   bk.name AS book_name, bl.borrow_date, bl.return_date, bl.created_on, bl.updated_on 
                    FROM borrow_log bl
                    LEFT JOIN students s ON bl.borrower_type = 'student' AND bl.borrower_id = s.student_id
                    LEFT JOIN teachers t ON bl.borrower_type = 'teacher' AND bl.borrower_id = t.teacher_id
                    JOIN subject sb ON bl.subject_id = sb.subject_id
                    JOIN books bk ON bl.book_id = bk.book_id
                    WHERE bl.borrow_id = $1;`

        const result = await pool.query(query, [id]);


        if (result.rows.length === 0) {
            return NextResponse.json({ message: 'Borrow log not found' }, { status: 404 });
        }

        return NextResponse.json({ book: result.rows[0] }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server error' }, { status: 500 });
    }
}