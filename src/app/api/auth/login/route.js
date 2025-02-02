
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const { username, password } = await req.json();

    if (!username || !password) {
        return NextResponse.json({ error: "Username and password is required" }, { status: 400 });
    }

    const query = "SELECT * FROM admin WHERE username = $1";
    const values = [username];

    try {
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return NextResponse.json({ error: "Username not found" }, { status: 400 });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid password' }, { status: 400 });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        return NextResponse.json({ message: "Login Successful" }, {
            headers: {
                'Set-Cookie': `jwt=${token}; HttpOnly; Max-Age=86400; Path=/; SameSite=Strict`,
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
