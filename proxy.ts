import { NextResponse } from "next/server";
import { auth } from "@/server/auth";

export const proxy = auth((req) => {
    if (!req.auth) {
        return NextResponse.redirect(new URL("/entrar", req.nextUrl.origin));
    }
});

export const config = {
    matcher: ["/dashboard/:path*"],
};