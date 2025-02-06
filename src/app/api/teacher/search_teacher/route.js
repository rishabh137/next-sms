import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { input, page, order, type } = await req.json();
    const limit = 5;
    const offset = (page - 1) * limit;

    try {
        const totalQuery = `SELECT COUNT(*) FROM teachers WHERE name ILIKE $1 OR contact ILIKE $2`;
        const totalResult = await pool.query(totalQuery, [`%${input}%`, `${input}%`]);

        const query = `
                    SELECT t.teacher_id, t.name, s.subject_name, t.contact, t.image, t.created_on, t.updated_on 
                    FROM teachers t
                    JOIN subject s ON t.subject_id = s.subject_id
                    WHERE 
                        name ILIKE $1 OR
                        contact ILIKE $2
                    ORDER BY ${order} ${type}
                    LIMIT $3 OFFSET $4
        `;
        const result = await pool.query(query, [`%${input}%`, `${input}%`, limit, offset]);

        return NextResponse.json({
            teachers: result.rows,
            pagination: Math.ceil(totalResult.rows[0].count / limit),
            totalRecords: totalResult.rows[0].count,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}