import { NextResponse } from "next/server";
import { searchMoviesApi } from "@/services/movies.api";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const page = searchParams.get("page") || "1";

    if (!query) {
        return NextResponse.json({ results: [] });
    }

    try {
        const data = await searchMoviesApi(query, Number(page));
        return NextResponse.json(data);
    } catch (error) {
        console.error("API Proxy Search Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch search results" },
            { status: 500 }
        );
    }
}