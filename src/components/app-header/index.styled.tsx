import { AppBar, styled, Toolbar } from "@mui/material";
import { Logout } from "@mui/icons-material";

export const AppBarStyled = styled(AppBar)`
  grid-area: header;
  position: static;
  padding-right: ${({ theme }) => theme.spacing(3)};
  padding-left: ${({ theme }) => theme.spacing(1)};
`;

export const AppBarToolbar = styled(Toolbar)`
  justify-content: space-between;
`;

export const LogoutStyled = styled(Logout)`
  vertical-align: middle;
  cursor: pointer;
`;
