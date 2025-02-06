import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    const query = "SELECT * FROM courses";

    try {
        const result = await pool.query(query);

        if (result.rows.length === 0) {
            return NextResponse.json({ error: "Course not found" }, { status: 400 });
        }

        const courses = result.rows;
        return NextResponse.json({ courses }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}