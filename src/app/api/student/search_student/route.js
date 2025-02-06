import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { input, page, order, type } = await req.json();
    const limit = 5;
    const offset = (page - 1) * limit;

    try {
        const totalQuery = `SELECT COUNT(*) FROM students WHERE name ILIKE $1 OR contact ILIKE $2`;
        const totalResult = await pool.query(totalQuery, [`%${input}%`, `${input}%`]);

        const query = `
                    SELECT s.student_id, s.name, s.roll, c.course_name, s.contact, s.status, s.image, s.created_on, s.updated_on 
                    FROM students s
                    JOIN courses c ON s.course_id = c.course_id
                    WHERE 
                        name ILIKE $1 OR
                        contact ILIKE $2
                    ORDER BY ${order} ${type}
                    LIMIT $3 OFFSET $4
        `;
        const result = await pool.query(query, [`%${input}%`, `${input}%`, limit, offset]);

        return NextResponse.json({
            students: result.rows,
            pagination: Math.ceil(totalResult.rows[0].count / limit),
            totalRecords: totalResult.rows[0].count,
        }, { status: 200 });
    } catch (error) {
        console.log(error);

        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}