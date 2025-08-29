import Box from "@mui/material/Box";
import styled from "@mui/material/styles/styled";
import { Span } from "./Typography";
import useSettings from "app/hooks/useSettings";

// STYLED COMPONENTS
const BrandRoot = styled(Box)(({ theme, mode }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: mode === "compact" ? "center" : "space-between",
  padding: mode === "compact" ? "10px" : "20px 18px 20px 29px",
  background: theme.palette.primary.main,
}));

const StyledSpan = styled(Span)(({ theme, mode }) => ({
  fontSize: 18,
  fontWeight: 500,
  color: theme.palette.common.white,
  display: mode === "compact" ? "none" : "block",
}));

const SubTitle = styled("div")(({ theme, mode }) => ({
  fontStyle: "italic",
  fontSize: 12,
  marginTop: "2px",
  color: theme.palette.common.white,
  display: mode === "compact" ? "none" : "block",
}));

export default function Brand({ children }) {
  const { settings } = useSettings();
  const leftSidebar = settings.layout1Settings.leftSidebar;
  const { mode } = leftSidebar;

  return (
    <BrandRoot mode={mode}>
      <Box display="flex" alignItems="center" justifyContent="center">
        <img
          src="/favicon.ico"
          alt="PyGenicArc Logo"
          style={{ height: mode === "compact" ? 32 : 42 }}
        />
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          ml={mode === "compact" ? 0 : 1}
        >
          <StyledSpan mode={mode} className="sidenavHoverShow">
            PyGenicArc
          </StyledSpan>
        </Box>
      </Box>

      <Box
        className="sidenavHoverShow"
        sx={{
          display: mode === "compact" ? "none" : "flex", // Use flex to align toggle button
          alignItems: "center",
          marginLeft: "16px", // Add margin to separate from title/logo
        }}
      >
        {children || null}
      </Box>
    </BrandRoot>
  );
}