"use client";

import dynamic from "next/dynamic";

const TableComplete = dynamic(
    () => import("@/components/tableComplete/tableComplete"),
    { ssr: false } 
  ); 

export default function Franquias() {
    return (
        <>
        <TableComplete/>
        </>
    )
};

