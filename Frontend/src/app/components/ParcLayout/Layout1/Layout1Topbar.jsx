import { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import styled from "@mui/material/styles/styled";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import Home from "@mui/icons-material/Home";
import Menu from "@mui/icons-material/Menu";
import Person from "@mui/icons-material/Person";
import Settings from "@mui/icons-material/Settings";
import PowerSettingsNew from "@mui/icons-material/PowerSettingsNew";

import useSettings from "app/hooks/useSettings";
import { Span } from "app/components/Typography";
import { ParcMenu, ParcSearchBox } from "app/components";
import { themeShadows } from "app/components/ParcTheme/themeColors";
import { topBarHeight } from "app/utils/constant";

// STYLED COMPONENTS
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary
}));

const TopbarRoot = styled("div")({
  top: 0,
  zIndex: 96,
  height: topBarHeight,
  boxShadow: themeShadows[8],
  transition: "all 0.3s ease"
});

const TopbarContainer = styled("div")(({ theme }) => ({
  padding: "8px",
  paddingLeft: 18,
  paddingRight: 20,
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: theme.palette.primary.main,
  [theme.breakpoints.down("sm")]: { paddingLeft: 16, paddingRight: 16 },
  [theme.breakpoints.down("xs")]: { paddingLeft: 14, paddingRight: 16 }
}));

const UserMenu = styled("div")({
  padding: 4,
  display: "flex",
  borderRadius: 24,
  cursor: "pointer",
  alignItems: "center",
  "& span": { margin: "0 8px" }
});

const StyledItem = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  minWidth: 185,
  "& a": {
    width: "100%",
    display: "flex",
    alignItems: "center",
    textDecoration: "none"
  },
  "& span": { marginRight: "10px", color: theme.palette.text.primary }
}));

const Layout1Topbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();
  const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));

  const updateSidebarMode = (sidebarSettings) => {
    updateSettings({ layout1Settings: { leftSidebar: { ...sidebarSettings } } });
  };

  const handleSidebarToggle = () => {
    let { layout1Settings } = settings;
    let mode;
    if (isMdScreen) {
      mode = layout1Settings.leftSidebar.mode === "close" ? "mobile" : "close";
    } else {
      mode = layout1Settings.leftSidebar.mode === "full" ? "close" : "full";
    }
    updateSidebarMode({ mode });
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    navigate("/login");
  };

  return (
    <TopbarRoot>
      <TopbarContainer>
        <Box display="flex">
          <StyledIconButton onClick={handleSidebarToggle}>
            <Menu />
          </StyledIconButton>
        </Box>

        <Box display="flex" alignItems="center">
          <ParcSearchBox />

          <ParcMenu
            menuButton={
              <UserMenu>
                <Span>
                  Hi <strong>Guest</strong>
                </Span>
                <Avatar sx={{ cursor: "pointer" }} />
              </UserMenu>
            }>
            <StyledItem>
              <Link to="/">
                <Home />
                <Span sx={{ marginInlineStart: 1 }}>Home</Span>
              </Link>
            </StyledItem>

            <StyledItem>
              <Link to="/page-layouts/user-profile">
                <Person />
                <Span sx={{ marginInlineStart: 1 }}>Profile</Span>
              </Link>
            </StyledItem>

            <StyledItem>
              <Settings />
              <Span sx={{ marginInlineStart: 1 }}>Settings</Span>
            </StyledItem>

            <StyledItem onClick={handleLogout}>
              <PowerSettingsNew />
              <Span sx={{ marginInlineStart: 1 }}>Logout</Span>
            </StyledItem>
          </ParcMenu>
        </Box>
      </TopbarContainer>
    </TopbarRoot>
  );
};

export default memo(Layout1Topbar);