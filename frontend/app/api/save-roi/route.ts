import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    const data = await req.json();

    await writeFile(
        "roi.json",
        JSON.stringify(data, null, 2)
    );

    return NextResponse.json({
        success: true
    });
}