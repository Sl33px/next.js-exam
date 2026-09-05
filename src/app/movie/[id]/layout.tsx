import React from "react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'MovieLayout metadata',
    description: 'layout description: movie'
}

type Props = { children: React.ReactNode }
const MovieLayout = ({ children }: Props) => {
    return (
        <>
            {children}
        </>
    )
}

export default MovieLayout