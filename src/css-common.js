import { createMuiTheme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { red, blue, brown, yellow, lightGreen } from "@material-ui/core/colors";

const drawerWidth = 240;
const white = "#fff";
const black = "#000";

const themePalette = {
  basil: {
    type: "light",
    background: { paper: "rgb(254, 251, 230)", default: "rgb(242, 245, 223)" },
    custom: {
      primary: "rgb(53, 104, 89)",
      secondary: "rgb(234, 237, 216)",
      contrastText: white,
    },
    contrastText: black,
  },
  crane: {
    type: "light",
    background: { paper: "rgb(255, 255, 255)", default: "rgb(237, 239, 235)" },
    custom: {
      primary: "rgb(93, 16, 73)",
      secondary: "rgb(240, 232, 237)",
      contrastText: white,
    },
    contrastText: black,
  },
  material: {
    type: "light",
    background: { paper: "rgb(255, 255, 255)", default: "rgb(245, 245, 245)" },
    custom: {
      primary: "rgb(25, 118, 210)",
      secondary: "rgb(235, 241, 251)",
      contrastText: white,
    },
    contrastText: black,
  },
  materialDark: {
    type: "dark",
    background: { paper: "rgb(66, 66, 66)", default: "rgb(51, 51, 51)" },
    custom: {
      primary: "#6d4c41",
      secondary: "#7cb342",
      contrastText: white,
    },
    contrastText: white,
  },
  pinky: {
    type: "light",
    background: { paper: "rgb(255, 255, 255)", default: "rgb(255, 231, 240)" },
    custom: {
      primary: "rgb(244, 3, 102)",
      secondary: "rgb(255, 231, 240)",
      contrastText: white,
    },
    contrastText: black,
  },
  rally: {
    type: "dark",
    background: { paper: "rgb(37, 40, 47)", default: "rgb(50, 51, 61)" },
    custom: {
      secondary: "rgb(52, 66, 60)",
      primary: "rgb(26, 93, 87)",
      contrastText: white,
    },
    contrastText: white,
  },
  reply: {
    type: "light",
    background: { paper: "rgb(254, 254, 254)", default: "rgb(237, 240, 242)" },
    custom: {
      secondary: "rgb(238, 241, 243)",
      primary: "rgb(52, 73, 85)",
      contrastText: white,
    },
    contrastText: black,
  },
};
// theme on of basil, crane, pinky, rally, reply
const makePalette = (type) => {
  const { contrastText, ...rest } = themePalette[type];
  return {
    ...rest,
    contrastText,
    contrastThreshold: 2,
    border: "#DFE3E8",
    divider: "#DFE3E8",
    common: {
      black,
      white,
      contrastText,
      commonBackground: "rgb(45, 45, 45)",
      neutral: "#E4E7EB",
      muted: "#9EA0A4",
    },
    primary: {
      light: brown[300],
      main: brown[500],
      dark: brown[700],
      contrastText,
    },
    secondary: {
      light: lightGreen[300],
      main: lightGreen[500],
      dark: lightGreen[700],
      contrastText,
    },
    success: {
      light: lightGreen[300],
      main: lightGreen[500],
      dark: lightGreen[700],
      contrastText,
    },
    info: {
      light: blue[300],
      main: blue[500],
      dark: blue[700],
      contrastText,
    },
    warning: {
      light: yellow[300],
      main: yellow[500],
      dark: yellow[700],
      contrastText,
    },
    danger: {
      light: red[300],
      main: red[500],
      dark: red[700],
      contrastText,
    },
  };
};

export function lightTheme() {
  const palette = makePalette("material");
  return createMuiTheme({
    type: "light",
    palette,
    typography: {
      useNextVariants: true,
      fontSize: 11,
      fontFamily: ["Montserrat", "sans-serif", "Helvetica Neue", "Arial"].join(
        ","
      ),
    },
  });
}
export function darkTheme() {
  const palette = makePalette("materialDark");
  return createMuiTheme({
    type: "dark",
    palette,
    typography: {
      useNextVariants: true,
      fontSize: 11,
      fontFamily: ["Montserrat", "sans-serif", "Helvetica Neue", "Arial"].join(
        ","
      ),
    },
  });
}

export const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  title: {
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(7) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));
