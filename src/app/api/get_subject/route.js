import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    const query = "SELECT * FROM subject";

    try {
        const result = await pool.query(query);

        if (result.rows.length === 0) {
            return NextResponse.json({ error: "Subject not found" }, { status: 400 });
        }

        const subject = result.rows;

        return NextResponse.json({ subject }, { status: 200 });
    } catch (error) {
        console.log(error);

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}