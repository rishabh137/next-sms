import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const response = NextResponse.json(
            { message: "Logged out successfully" },
            { status: 200 }
        );
        response.cookies.set("jwt", "", { maxAge: 0 });
        return response;
    } catch (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
