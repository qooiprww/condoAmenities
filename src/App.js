import React, { useEffect } from "react";
import clsx from "clsx";
import settings, { TASK_CHOICES } from "./settings";
import { useTheme, makeStyles, withStyles } from "@material-ui/core/styles";
import { useStyles } from "./css-common";
import { Switch, Route, Link } from "react-router-dom";
import { darkTheme, lightTheme } from "./css-common";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import EcoIcon from "@material-ui/icons/Eco";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import GridOnIcon from "@material-ui/icons/GridOn";
import ComputerIcon from "@material-ui/icons/Computer";
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";
import ControlCameraIcon from "@material-ui/icons/ControlCamera";
import TimelineIcon from "@material-ui/icons/Timeline";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import RefreshIcon from "@material-ui/icons/Refresh";
import DoneIcon from "@material-ui/icons/Done";
import { ThemeProvider } from "@material-ui/styles";
import TaskDataService from "./services/task.service";
import AmbientDataDataService from "./services/ambient_data.service";
import {
  AppBar,
  Toolbar,
  Typography,
  Switch as ToggleSwitch,
  CssBaseline,
  IconButton,
  FormControlLabel,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  Grid,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Paper,
} from "@material-ui/core";

//import SeedContainer from "./components/seed_container.component";
//import SeedContainersList from "./components/seed_containers-list.component";
import SeedContainer from "./components/seed_container.component";

function getSteps() {
  return ["Queued", "Executing", "Finished"];
}

const ColorlibConnector = withStyles({
  active: {
    "& $line": {
      backgroundImage:
        "linear-gradient( 136deg, rgb(133,242,33) 0%, rgb(64,233,87) 50%, rgb(35,138,135) 100%)",
    },
  },
  completed: {
    "& $line": {
      backgroundImage:
        "linear-gradient( 136deg, rgb(133,242,33) 0%, rgb(64,233,87) 50%, rgb(35,138,135) 100%)",
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 30,
    height: 30,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    backgroundImage:
      "linear-gradient( 136deg, rgb(133,242,33) 0%, rgb(64,233,87) 50%, rgb(35,138,135) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  },
  completed: {
    backgroundImage:
      "linear-gradient( 136deg, rgb(133,242,33) 0%, rgb(64,233,87) 50%, rgb(35,138,135) 100%)",
  },
});

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: <QueryBuilderIcon />,
    2: <DoubleArrowIcon />,
    3: <DoneIcon />,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

export default function MiniDrawer() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [isDark, setTheme] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [currentTask, setCurrentTask] = React.useState("Empty");
  const [nextTask, setNextTask] = React.useState("Empty");
  const [ambientHmidity, setAmbientHmidity] = React.useState(0.0);
  const [ambientLightIntensity, setAmbientLightIntensity] = React.useState(0.0);
  const [ambientTemperature, setAmbientTemperature] = React.useState(0.0);
  const [dataDateTime, setDataDateTime] = React.useState(new Date());
  const steps = getSteps();

  const getActiveStep = () => {
    TaskDataService.getCurrentTask()
      .then((response) => {
        if (response.data !== "empty") {
          setCurrentTask(TASK_CHOICES[response.data[0].task_type]);

          if (response.data[0].task_status === settings.TASK_STATUS_QUEUED) {
            setActiveStep((prevActiveStep) => 0);
          } else if (
            response.data[0].task_status === settings.TASK_STATUS_EXECUTING
          ) {
            setActiveStep((prevActiveStep) => 1);
          } else if (
            response.data[0].task_status === settings.TASK_STATUS_FINISHED
          ) {
            setActiveStep((prevActiveStep) => 2);
          }
        } else {
          setCurrentTask("Empty");
        }
      })
      .catch((e) => {
        console.log(e);
      });
    TaskDataService.getNextTask()
      .then((response) => {
        if (response.data !== "empty") {
          setNextTask(TASK_CHOICES[response.data[0].task_type]);
          console.log(response.data);
        } else {
          setNextTask("Empty");
        }
      })
      .catch((e) => {
        console.log(e);
      });
    AmbientDataDataService.getLatest()
      .then((response) => {
        if (response.data !== "empty") {
          setAmbientHmidity(response.data[0].ambient_humidity);
          setAmbientTemperature(response.data[0].ambient_temperature);
          setAmbientLightIntensity(response.data[0].ambient_light_intensity);
          setDataDateTime(response.data[0].ambient_data_date_time);
          console.log(response.data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const setDarkTheme = () => {
    setTheme(!isDark);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getActiveStep();
  });

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}
            >
              <MenuIcon />
            </IconButton>
            <Grid container spacing={1} className={classes.toolbar}>
              <Grid item xs>
                <Typography className={classes.title} variant="h6" noWrap>
                  Plant Condo
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography className={classes.title} noWrap>
                  Current Task: {currentTask}
                </Typography>
              </Grid>
              <Grid item xs>
                <Stepper
                  style={{ backgroundColor: "transparent" }}
                  className={classes.appBar}
                  activeStep={activeStep}
                  connector={<ColorlibConnector />}
                >
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel
                        StepIconComponent={ColorlibStepIcon}
                        className={classes.title}
                      >
                        {label}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Grid>
              <Grid>
                <label htmlFor="icon-button-file">
                  <IconButton
                    aria-label="upload picture"
                    component="span"
                    onClick={getActiveStep}
                  >
                    <RefreshIcon />
                  </IconButton>
                </label>
              </Grid>
              <Grid item xs>
                <Typography className={classes.title} noWrap>
                  Next Task: {nextTask}
                </Typography>
              </Grid>

              {/* <Grid item xs>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary={"Ambient Humidity: " + ambientHmidity.toString()}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={
                        "Ambient Temperature: " + ambientTemperature.toString()
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={
                        "Ambient Light Intensity: " +
                        ambientLightIntensity.toString()
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={
                        "Data retrieved on: " +
                        new Date(dataDateTime).toLocaleTimeString("en-US", {
                          timeZone: "US/Eastern",
                        })
                      }
                    />
                  </ListItem>
                </List>
              </Grid> */}

              <Grid item xs>
                <FormControlLabel
                  control={<Switch checked={isDark} onChange={setDarkTheme} />}
                  label="Dark Theme"
                />
                <ToggleSwitch
                  checked={isDark}
                  onChange={setDarkTheme}
                  name="Dark Theme"
                />{" "}
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Paper>
          <div className={classes.toolbar} />
        </Paper>
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItem button key={"condo_dashboard"}>
              <ListItemIcon>
                <ComputerIcon />
              </ListItemIcon>
              <ListItemText primary={"Condo Dashboard"} />
            </ListItem>
            <ListItem button key={"plant_dashboard"}>
              <ListItemIcon>
                <ControlCameraIcon />
              </ListItemIcon>
              <ListItemText primary={"Plant Dashboard"} />
            </ListItem>
            <ListItem button key={"data_analytics"}>
              <ListItemIcon>
                <TimelineIcon />
              </ListItemIcon>
              <ListItemText primary={"Data Analytics"} />
            </ListItem>
            <ListItem button key={"grid_planning"}>
              <ListItemIcon>
                <GridOnIcon />
              </ListItemIcon>
              <ListItemText primary={"Grid Planning"} />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem
              button
              key={"seed_container"}
              component={Link}
              to="/seedContainers"
            >
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={"Seed Container"} />
            </ListItem>
            <ListItem button key={"plant_type"}>
              <ListItemIcon>
                <EcoIcon />
              </ListItemIcon>
              <ListItemText primary={"Plant Gallery"} />
            </ListItem>
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar}>
            <Switch>
              {/* <Route exact path={["/", "/seedContainers"]} component={SeedContainersList} /> */}
              {/* <Route path="/seedContainers/:id" component={SeedContainer} /> */}
              <Route exact path="/seedContainers" component={SeedContainer} />
            </Switch>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
