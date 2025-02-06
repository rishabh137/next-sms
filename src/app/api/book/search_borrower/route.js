import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { input, page, order, type } = await req.json();
    const limit = 5;
    const offset = (page - 1) * limit;

    try {
        const totalQuery = `SELECT COUNT(*)
                            FROM borrow_log bl
                            LEFT JOIN students s ON bl.borrower_type = 'student' AND bl.borrower_id = s.student_id
                            LEFT JOIN teachers t ON bl.borrower_type = 'teacher' AND bl.borrower_id = t.teacher_id
                            JOIN books bk ON bl.book_id = bk.book_id
                            WHERE 
                                (s.name LIKE $1 OR t.name LIKE $2 OR bk.name LIKE $3)`
        const totalResult = await pool.query(totalQuery, [`%${input}%`, `%${input}%`, `%${input}%`]);

        const query = `
                    SELECT bl.borrow_id, bl.book_id, bl.borrower_type, sb.subject_name,
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
                    WHERE 
                        (s.name LIKE $1 OR t.name LIKE $2 OR bk.name LIKE $3) 
                    ORDER BY ${order} ${type}
                    LIMIT $4 OFFSET $5
        `;
        const result = await pool.query(query, [`%${input}%`, `%${input}%`, `%${input}%`, limit, offset]);

        return NextResponse.json({
            borrowers: result.rows,
            pagination: Math.ceil(totalResult.rows[0].count / limit),
            totalRecords: totalResult.rows[0].count,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}