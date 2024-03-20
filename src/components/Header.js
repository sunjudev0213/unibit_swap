import { useState } from "react";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { FacebookIcon, TwitterIcon } from "react-share";

// Material
import { alpha, styled, useMediaQuery, useTheme, AppBar, Box, Button, Container, Divider, Grid, IconButton, Link, Menu, MenuItem, Stack, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";

import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SwapCallsIcon from "@mui/icons-material/SwapCalls";

// Iconify Icons
import { Icon } from "@iconify/react";
import baselineBrightnessHigh from "@iconify/icons-ic/baseline-brightness-high";
import baselineBrightness4 from "@iconify/icons-ic/baseline-brightness-4";

// Context
import { useContext } from "react";
import { AppContext } from "src/AppContext";

// Components
import Logo from "./Logo";
import Wallet from "./Wallet";
import HeaderMobileMenu from "./HeaderMobileMenu";

const HeaderWrapper = styled(AppBar)(
    ({ theme }) => `
    width: 100%;
    background-color: ${theme.colors.nav.background};
    margin-bottom: ${theme.spacing(0)};
    justify-content: center;
    border: none;
    border-radius: 0px;
    border-bottom: 0px solid ${alpha("#CBCCD2", 0.2)};
    // position: -webkit-sticky;
    // position: sticky;
    // top: 0;
    // z-index: 1300;
`
);

export default function Header() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const { toggleTheme, darkMode } = useContext(AppContext);

    return (
        <HeaderWrapper position="sticky" enableColorOnDark={true} sx={{ py: 1, opacity: isMobile ? 0.9 : 0.6 }}>
            <Container maxWidth="xl" sx={{ minWidth: "90%" }}>
                <Toolbar disableGutters>
                    <Box
                        id="logo-container-mobile"
                        sx={{
                            mr: 2
                        }}
                    >
                        <Logo />
                    </Box>

                    <Box
                        sx={{
                            flexGrow: 1,
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center"
                        }}
                    >
                        {!isMobile && (
                            <>
                                <Link underline="none" color="inherit" href={`/`} rel="noreferrer noopener nofollow">
                                    <Button variant="text">Swap</Button>
                                </Link>
                                <Link underline="none" color="inherit" href={`/pool`} rel="noreferrer noopener nofollow">
                                    <Button variant="text">Liquidity Pool</Button>
                                </Link>
                                <Link underline="none" color="inherit" href={`/staking`} rel="noreferrer noopener nofollow">
                                    <Button variant="text">Staking</Button>
                                </Link>
                                <Link underline="none" color="inherit" href={`/create`} rel="noreferrer noopener nofollow">
                                    <Button variant="text">BRC20</Button>
                                </Link>
                                <Link underline="none" color="inherit" href={`https://bridge.unibit.app`} rel="noreferrer noopener nofollow" target="blank">
                                    <Button variant="text">Bridge</Button>
                                </Link>
                            </>
                        )}

                        <Wallet />
                        {!isMobile && (
                            <IconButton
                                onClick={() => {
                                    toggleTheme();
                                }}
                            >
                                {darkMode ? <Icon icon={baselineBrightness4} /> : <Icon icon={baselineBrightnessHigh} />}
                            </IconButton>
                        )}
                    </Box>

                    <HeaderMobileMenu />
                </Toolbar>
            </Container>
        </HeaderWrapper>
    );
}
