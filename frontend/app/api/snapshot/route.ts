import { NextResponse } from "next/server";
import DigestFetch from "digest-fetch";

export async function GET() {
  try {
    const client = new DigestFetch("admin", "password12");

    const response = await client.fetch(
      "http://192.168.2.52/ISAPI/Streaming/Channels/101/picture"
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Camera returned ${response.status}` },
        { status: response.status }
      );
    }

    const image = await response.arrayBuffer();

    return new Response(image, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to connect to camera" },
      { status: 500 }
    );
  }
}