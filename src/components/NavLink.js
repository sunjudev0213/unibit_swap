import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@mui/material";

export default function NavLink({ link, text, external }) {
    const router = useRouter();
    return (
        <Link underline="none" color="inherit" href={link} rel="noreferrer noopener nofollow" target={external && "_blank"}>
            <Button variant={`${link === router.pathname ? "contained" : "text"}`} sx={{ mx: 1 }}>
                {text}
            </Button>
        </Link>
    );
}
