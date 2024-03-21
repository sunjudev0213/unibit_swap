import React, { useState, useContext } from "react";
// Material
import { Container, Stack, TextField, Button, Typography, FormControl, RadioGroup, FormControlLabel, Radio } from "@mui/material";
// Context
import { AppContext } from "src/AppContext";
//component
import Page from "src/components/Page";

export default function StakingComponent() {
    const { openSnackbar, darkMode } = useContext(AppContext);
    return (
    <Page title="Create">
        <Stack justifyContent="center" alignItems="center" display="flex" minHeight="80vh">
            <Container maxWidth="md"
                minWidth="35vw"
                sx={{
                    borderRadius: "10px",
                    border: darkMode ? "1px solid rgb(255, 255, 255)" : "1px solid rgb(0, 0, 0, 0.3)",
                    padding: "20px 30px"
                }}>
                    StakingComponent
            </Container>
        </Stack>
    </Page>
    );
}
