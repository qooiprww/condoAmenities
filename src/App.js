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
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";
import ControlCameraIcon from "@material-ui/icons/ControlCamera";
import TimelineIcon from "@material-ui/icons/Timeline";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import RefreshIcon from "@material-ui/icons/Refresh";
import DoneIcon from "@material-ui/icons/Done";
import { ThemeProvider } from "@material-ui/styles";
import TaskDataService from "./services/task.service";

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
} from "@material-ui/core";

//import SeedContainer from "./components/seed_container.component";
//import SeedContainersList from "./components/seed_containers-list.component";
import SeedContainer from "./components/seed_container.component";
import CondoDashboard from "./components/condo_dashboard.component";
import PlantDashboard from "./components/plant_dashboard.component";
import GridPlanner from "./components/grid_planner.component";
import PlantType from "./components/plant_type.component";

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

  const steps = getSteps();

  const getActiveStep = () => {
    TaskDataService.getCurrentTask()
      .then((response) => {
        if (response.data !== "empty") {
          setCurrentTask(response.data[0]);
          if (response.data[0].task_status === settings.TASK_STATUS_QUEUED) {
            setActiveStep(0);
          } else if (
            response.data[0].task_status === settings.TASK_STATUS_EXECUTING
          ) {
            setActiveStep(1);
          } else if (
            response.data[0].task_status === settings.TASK_STATUS_FINISHED
          ) {
            setActiveStep(2);
          }
        } else {
          setCurrentTask("Empty");
          setActiveStep(0);
        }
      })
      .catch((e) => {
        console.log(e);
      });
    TaskDataService.getNextTask()
      .then((response) => {
        if (response.data !== "empty") {
          setNextTask(response.data[0]);
        } else {
          setNextTask("Empty");
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
  }, [open]);

  return (
    <ThemeProvider theme={isDark ? darkTheme() : lightTheme()}>
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
              <Grid item xs={2}>
                <Typography className={classes.title} variant="h4" noWrap>
                  Plant Condo
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography
                  variant="h6"
                  align="center"
                  color="textPrimary"
                  noWrap
                  component={Link}
                  to={
                    currentTask !== "Empty"
                      ? currentTask.plant
                        ? "/plantDashboard/" + currentTask.plant
                        : "/condoDashboard"
                      : "/condoDashboard"
                  }
                >
                  Current Task:{" "}
                  {currentTask !== "Empty"
                    ? TASK_CHOICES[currentTask.task_type]
                    : currentTask}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Stepper
                  style={{ backgroundColor: "transparent" }}
                  className={(classes.appBar, classes.title)}
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
              <Grid item xs={2}>
                <Typography
                  className={classes.title}
                  align="center"
                  variant="h6"
                  noWrap
                  component={Link}
                  color="textPrimary"
                  to={
                    nextTask !== "Empty"
                      ? nextTask.plant
                        ? "/plantDashboard/" + nextTask.plant
                        : "/condoDashboard"
                      : "/condoDashboard"
                  }
                >
                  Next Task:{" "}
                  {nextTask !== "Empty"
                    ? TASK_CHOICES[nextTask.task_type]
                    : nextTask}
                </Typography>
              </Grid>
              <Grid item xs={1}>
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

              <Grid item xs={1}>
                <FormControlLabel
                  control={<Switch checked={isDark} onChange={setDarkTheme} />}
                  label="Dark Theme"
                />
                <ToggleSwitch
                  checked={isDark}
                  onChange={setDarkTheme}
                  name="Dark Theme"
                />
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
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
            <ListItem
              button
              key={"condoDashboard"}
              component={Link}
              to="/condoDashboard"
            >
              <ListItemIcon>
                <TimelineIcon />
              </ListItemIcon>
              <ListItemText primary={"Condo Dashboard"} />
            </ListItem>
            <ListItem
              button
              key={"plant_dashboard"}
              component={Link}
              to={
                currentTask !== "Empty"
                  ? currentTask.plant
                    ? "/plantDashboard/" + currentTask.plant
                    : "/plantDashboard/1"
                  : "/plantDashboard/1"
              }
            >
              <ListItemIcon>
                <ControlCameraIcon />
              </ListItemIcon>
              <ListItemText primary={"Plant Dashboard"} />
            </ListItem>

            <ListItem
              button
              key={"grid_planning"}
              component={Link}
              to="/gridPlanner"
            >
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
            <ListItem
              button
              key={"plant_type"}
              component={Link}
              to="/plantType"
            >
              <ListItemIcon>
                <EcoIcon />
              </ListItemIcon>
              <ListItemText primary={"Plant Gallery"} />
            </ListItem>
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Switch>
            {/* <Route exact path={["/", "/seedContainers"]} component={SeedContainersList} /> */}
            <Route path="/condoDashboard" component={CondoDashboard} />
            <Route path="/plantDashboard/:id" component={PlantDashboard} />
            <Route exact path="/seedContainers" component={SeedContainer} />
            <Route exact path="/plantType" component={PlantType} />
            <Route exact path="/gridPlanner" component={GridPlanner} />
          </Switch>
        </main>
      </div>
    </ThemeProvider>
  );
}
