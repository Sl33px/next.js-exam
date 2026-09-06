import Link from "next/link";
import UserInfoComponent from "../UserInfo/UserInfoComponent";
import SearchInputComponent from "@/components/SearchInput/SearchInputComponent";
import {Suspense} from "react";

const HeaderComponent = () => {
    return (
        <header className="sticky top-0 z-50 w-full bg-zinc-950/90 backdrop-blur-md border-b border-white/10 shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">

                <Link
                    href="/"
                    className="text-xl font-bold tracking-wider text-white hover:text-blue-400 transition-colors"
                >
                    MOVIES
                </Link>

                <Suspense fallback={<div className="w-48 h-10 bg-zinc-800 rounded-xl animate-pulse" />}>
                    <SearchInputComponent />
                </Suspense>

                <UserInfoComponent />
            </div>
        </header>
    );
};

export default HeaderComponent;