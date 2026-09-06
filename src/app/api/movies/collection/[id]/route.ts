import { NextResponse } from "next/server";
import { getCollectionByID } from "@/services/movies.api";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json(
            { error: "Collection ID is required" },
            { status: 400 }
        );
    }

    try {
        const data = await getCollectionByID(Number(id));
        return NextResponse.json(data);
    } catch (error) {
        console.error("API Proxy Collection Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch collection" },
            { status: 500 }
        );
    }
}