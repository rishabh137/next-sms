import pool from "@/lib/db";
import path from "path";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

async function ensureDirectoryExists(dirPath) {
    try {
        await mkdir(dirPath, { recursive: true });
    } catch (error) {
        if (error.code !== 'EEXIST') {
            throw error;
        }
    }
}

export async function POST(req) {
    try {
        const formData = await req.formData();

        const name = formData.get('name');
        const subject = formData.get('subject');
        const contact = formData.get('contact');
        const image = formData.get('image');


        let imagePath = null;

        if (image && image.name) {
            const uploadDir = join('public', 'uploads');
            await ensureDirectoryExists(uploadDir);

            const fileExtension = path.extname(image.name) || '.jpg';
            const filename = `${Date.now()}${fileExtension}`;
            const filepath = join(uploadDir, filename);

            const bytes = await image.arrayBuffer();
            await writeFile(filepath, Buffer.from(bytes));

            imagePath = filename;
        }

        if (!name || !subject || !contact) {
            return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
        }

        let query = 'SELECT * FROM teachers WHERE contact = $1';
        let values = [contact];
        let result = await pool.query(query, values);

        if (result.rows.length > 0) {
            return NextResponse.json({ error: "Teacher with this contact already exists." }, { status: 400 });
        }

        query = 'INSERT INTO teachers (name, subject_id, contact, image) VALUES ($1, $2, $3, $4)';
        values = [name, subject, contact, imagePath];
        await pool.query(query, values);

        return NextResponse.json({ message: 'Teacher added successfully.' }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}