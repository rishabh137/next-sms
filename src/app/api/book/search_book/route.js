import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { input, page, order, type } = await req.json();
    const limit = 5;
    const offset = (page - 1) * limit;

    try {
        const totalQuery = `SELECT COUNT(*) FROM books WHERE name ILIKE $1 OR author ILIKE $2 OR isbn ILIKE $3`;
        const totalResult = await pool.query(totalQuery, [`%${input}%`, `%${input}%`, `${input}%`]);

        const query = `
                    SELECT b.*, s.*
                    FROM books b
                    JOIN subject s ON b.subject_id = s.subject_id
                    WHERE 
                        name ILIKE $1 OR 
                        author ILIKE $2 OR 
                        isbn ILIKE $3
                    ORDER BY ${order} ${type}
                    LIMIT $4 OFFSET $5
        `;
        const result = await pool.query(query, [`%${input}%`, `%${input}%`, `${input}%`, limit, offset]);

        return NextResponse.json({
            books: result.rows,
            pagination: Math.ceil(totalResult.rows[0].count / limit),
            totalRecords: totalResult.rows[0].count,
        }, { status: 200 });
    } catch (error) {
        NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}