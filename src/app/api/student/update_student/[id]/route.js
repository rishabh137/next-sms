import pool from "@/lib/db";
import path from "path";
import { mkdir, unlink, writeFile } from 'fs/promises';
import { NextResponse } from "next/server";
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

async function deleteOldImage(imagePath) {
    if (imagePath) {
        const fullPath = join('public/uploads', imagePath);
        try {
            await unlink(fullPath);
            console.log('Successfully deleted old image:', imagePath);
        } catch (error) {
            if (error.code !== 'ENOENT') {
                console.error('Error deleting old image:', error);
            }
        }
    }
}

export async function PUT(req, { params }) {
    try {
        const { id } = params;
        const formData = await req.formData();

        const name = formData.get('name');
        const roll = formData.get('roll');
        const course = formData.get('course');
        const semester = formData.get('semester');
        const contact = formData.get('contact');
        const status = formData.get('status');
        const image = formData.get('image');
        const deleteImage = formData.get('deleteImage') === 'true';

        if (!name || !roll || !course || !semester || !contact) {
            return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
        }

        let query = 'SELECT * FROM students WHERE roll = $1 AND student_id != $2 AND course_id = $3';
        let values = [roll, id, course];
        let result = await pool.query(query, values);

        if (result.rows.length > 0) {
            return NextResponse.json({ error: "Roll number already exists in the same course." }, { status: 400 });
        }

        query = 'SELECT image FROM students WHERE student_id = $1';
        result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

        const oldImagePath = result.rows[0].image;
        let newImagePath = oldImagePath;

        if (deleteImage) {
            await deleteOldImage(oldImagePath);
            newImagePath = null;
        }
        else if (image && image.size > 0) {
            await deleteOldImage(oldImagePath);

            const uploadDir = join('public', 'uploads');
            await ensureDirectoryExists(uploadDir);

            const fileExtension = image.name ? path.extname(image.name) : '.jpg';
            const filename = `${Date.now()}${fileExtension}`;
            const filepath = join(uploadDir, filename);

            const bytes = await image.arrayBuffer();
            await writeFile(filepath, Buffer.from(bytes));

            newImagePath = filename;
        }

        query = `
            UPDATE students 
            SET name = $1, roll = $2, course_id = $3, semester = $4, 
                contact = $5, status = $6, image = $7, updated_on = CURRENT_TIMESTAMP
            WHERE student_id = $8
        `;
        values = [name, roll, course, semester, contact, status, newImagePath, id];
        await pool.query(query, values);

        return NextResponse.json({ message: 'Student updated successfully.' }, { status: 200 });

    } catch (error) {
        console.error('Error updating student:', error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}