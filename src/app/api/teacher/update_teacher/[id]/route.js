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
        const subject = formData.get('subject');
        const contact = formData.get('contact');
        const image = formData.get('image');
        const deleteImage = formData.get('deleteImage') === 'true';

        if (!name || !subject || !contact) {
            return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
        }

        let query = 'SELECT * FROM teachers WHERE contact = $1 AND teacher_id != $2';
        let values = [contact, id];
        let result = await pool.query(query, values);

        if (result.rows.length > 0) {
            return NextResponse.json({ error: "Contact already exists for another teacher." }, { status: 400 });
        }

        query = 'SELECT image FROM teachers WHERE teacher_id = $1';
        result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
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
            UPDATE teachers 
            SET name = $1, subject_id = $2, contact = $3, 
                image = $4, updated_on = CURRENT_TIMESTAMP
            WHERE teacher_id = $5
        `;
        values = [name, subject, contact, newImagePath, id];
        await pool.query(query, values);

        return NextResponse.json({ message: 'Teacher updated successfully.' }, { status: 200 });

    } catch (error) {
        console.error('Error updating teacher:', error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}