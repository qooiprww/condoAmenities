import React, { useEffect } from "react";
import AmbientDataDataService from "../services/ambient_data.service";
import TaskDataService from "../services/task.service";
import PlantDataService from "../services/plant.service";
import { Link } from "react-router-dom";
import {
  Grid,
  CardContent,
  Box,
  Container,
  CardHeader,
  Card,
  Typography,
  Divider,
  useTheme,
  Button,
} from "@material-ui/core";
import settings, { TASK_CHOICES } from "../settings";
import { makeStyles } from "@material-ui/core";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const CondoDashboard = ({ staticContext, ...props }) => {
  const [ambientData, setAmbientData] = React.useState([]);
  const [ambientHmidity, setAmbientHmidity] = React.useState(0.0);
  const [ambientLightIntensity, setAmbientLightIntensity] = React.useState(0.0);
  const [ambientTemperature, setAmbientTemperature] = React.useState(0.0);
  const [dataDateTime, setDataDateTime] = React.useState(new Date());
  const [currentTask, setCurrentTask] = React.useState(null);
  const [currentTaskPlant, setCurrentTaskPlant] = React.useState(null);
  const [nextTask, setNextTask] = React.useState(null);
  const [nextTaskPlant, setNextTaskPlant] = React.useState(null);
  const theme = useTheme();

  const useStyles = makeStyles((theme) => ({
    root: {
      padding: theme.spacing(4),
    },
  }));

  const classes = useStyles({ ...props });

  const retrieveLatestAmbientData = () => {
    AmbientDataDataService.getLatest()
      .then((response) => {
        if (response.data !== "empty") {
          setAmbientHmidity(response.data[0].ambient_humidity);
          setAmbientTemperature(response.data[0].ambient_temperature);
          setAmbientLightIntensity(response.data[0].ambient_light_intensity);
          setDataDateTime(response.data[0].ambient_data_date_time);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const getAmbientData = () => {
    var data = {
      task_type: settings.TASK_AMBIENT_DATA_GATHERING,
    };
    TaskDataService.create(data)
      .then((response) => {
        retrieveLatestTaskData();
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const formatXAxis = (tickItem) => {
    // If using moment.js
    return new Date(tickItem).toLocaleDateString("en-US", {
      timeZone: "US/Eastern",
    });
  };
  const formatToolTipLabel = (value) => {
    return [
      new Date(value).toLocaleString("en-US", {
        timeZone: "US/Eastern",
      }),
    ];
  };
  const formatToolTipTemperature = (value, name, prop) => {
    return [value.toString() + "\u00b0C", "Temperature"];
  };
  const formatToolTipHumidity = (value, name, prop) => {
    return [value.toString() + "%", "Humidity"];
  };
  const formatToolTipLightIntensity = (value, name, prop) => {
    return [value.toString() + "%", "Light Intensity"];
  };

  const retrieveLatestTaskData = () => {
    TaskDataService.getCurrentTask()
      .then((response) => {
        if (response.data !== "empty") {
          setCurrentTask(response.data[0]);
          if (response.data[0].plant) {
            PlantDataService.get(response.data[0].plant)
              .then((plantResponse) => {
                setCurrentTaskPlant(plantResponse.data);
              })
              .catch((e) => {
                console.log(e);
              });
          }
        } else {
          setCurrentTask(null);
        }
      })
      .catch((e) => {
        console.log(e);
      });
    TaskDataService.getNextTask()
      .then((response) => {
        if (response.data !== "empty") {
          setNextTask(response.data[0]);
          if (response.data[0].plant) {
            PlantDataService.get(response.data[0].plant)
              .then((plantResponse) => {
                setNextTaskPlant(plantResponse.data);
              })
              .catch((e) => {
                console.log(e);
              });
          }
        } else {
          setNextTask(null);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const retrieveAmbientData = () => {
    AmbientDataDataService.getAll()
      .then((response) => {
        setAmbientData(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    retrieveAmbientData();
    retrieveLatestAmbientData();
    retrieveLatestTaskData();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        minHeight: "100%",
        py: 3,
      }}
    >
      <Container maxWidth={false} className={classes.root}>
        <Grid container spacing={4}>
          <Grid item lg={4} sm={6} xl={4} xs={12}>
            <Card className={classes.root}>
              <CardHeader title="Ambient Humidity" />
              <Divider />
              <CardContent>
                <Grid container justify="space-between">
                  <Grid item>
                    <Typography variant="h4">
                      {ambientHmidity.toString()}%
                    </Typography>
                    <Typography variant="h6">
                      Data retrieved on:{" "}
                      {new Date(dataDateTime).toLocaleString("en-US", {
                        timeZone: "US/Eastern",
                      })}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item lg={4} sm={6} xl={4} xs={12}>
            <Card className={classes.root}>
              <CardHeader title="Ambient Temperature" />
              <Divider />
              <CardContent>
                <Grid container justify="space-between">
                  <Grid item>
                    <Typography variant="h4">
                      {ambientTemperature.toString()}
                      {"\u00b0"}C
                    </Typography>
                    <Typography variant="h6">
                      Data retrieved on:{" "}
                      {new Date(dataDateTime).toLocaleString("en-US", {
                        timeZone: "US/Eastern",
                      })}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item lg={4} sm={6} xl={4} xs={12}>
            <Card className={classes.root}>
              <CardHeader title="Ambient Light Intensity" />
              <Divider />
              <CardContent>
                <Grid container justify="space-between">
                  <Grid item>
                    <Typography variant="h4">
                      {ambientLightIntensity.toString()}%
                    </Typography>
                    <Typography variant="h6">
                      Data retrieved on:{" "}
                      {new Date(dataDateTime).toLocaleString("en-US", {
                        timeZone: "US/Eastern",
                      })}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item lg={8} sm={12} xl={9} xs={12}>
            <Card {...props}>
              <CardHeader title="Ambient Humidity" /> <Divider />
              <CardContent>
                <ResponsiveContainer width="100%" height={120}>
                  <AreaChart
                    data={ambientData}
                    syncId="date"
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="ambient_data_date_time"
                      tickFormatter={formatXAxis}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={formatToolTipHumidity}
                      labelFormatter={formatToolTipLabel}
                      contentStyle={{
                        backgroundColor:
                          theme.type === "dark" ? "#424242" : "#ffffff",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="ambient_humidity"
                      stroke="#775447"
                      fill="#775447"
                    />
                  </AreaChart>
                </ResponsiveContainer>{" "}
              </CardContent>
            </Card>
            <div style={{ height: "16px" }} />
            <Card {...props}>
              <CardHeader title="Ambient Temperature" /> <Divider />
              <CardContent>
                <ResponsiveContainer width="100%" height={120}>
                  <AreaChart
                    data={ambientData}
                    syncId="date"
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="ambient_data_date_time"
                      tickFormatter={formatXAxis}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={formatToolTipTemperature}
                      labelFormatter={formatToolTipLabel}
                      contentStyle={{
                        backgroundColor:
                          theme.type === "dark" ? "#424242" : "#ffffff",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="ambient_temperature"
                      stroke="#7cb342"
                      fill="#7cb342"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <div style={{ height: "16px" }} />
            <Card {...props}>
              <CardHeader title="Ambient Light Intensity" /> <Divider />
              <CardContent>
                <ResponsiveContainer width="100%" height={120}>
                  <AreaChart
                    data={ambientData}
                    syncId="date"
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="ambient_data_date_time"
                      tickFormatter={formatXAxis}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={formatToolTipLightIntensity}
                      labelFormatter={formatToolTipLabel}
                      contentStyle={{
                        backgroundColor:
                          theme.type === "dark" ? "#424242" : "#ffffff",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="ambient_light_intensity"
                      stroke="#1e88e5"
                      fill="#1e88e5"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Card className={classes.root}>
              <CardHeader title="Task Engine" />
              <Divider />
              <CardContent>
                <Grid container justify="space-between">
                  <Grid item>
                    <Typography variant="h6">
                      Current Task:{" "}
                      {currentTask
                        ? TASK_CHOICES[currentTask.task_type]
                        : "Empty"}
                    </Typography>
                    <Typography variant="h6">
                      Status: {currentTask ? currentTask.task_status : "Empty"}
                    </Typography>
                    <Typography
                      variant="h6"
                      component={Link}
                      to={
                        currentTask
                          ? currentTask.plant
                            ? "/plantDashboard/" + currentTask.plant
                            : "/condoDashboard"
                          : "/condoDashboard"
                      }
                    >
                      Plant Name:{" "}
                      {currentTask
                        ? currentTask.plant
                          ? currentTaskPlant
                            ? currentTaskPlant.plant_name
                            : "Empty"
                          : "Empty"
                        : "Empty"}
                    </Typography>
                    <Typography variant="h6">
                      Task Received on:{" "}
                      {currentTask
                        ? new Date(currentTask.task_date_time).toLocaleString(
                            "en-US",
                            {
                              timeZone: "US/Eastern",
                            }
                          )
                        : "Empty"}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              <CardContent>
                <Grid container justify="space-between">
                  <Grid item>
                    <Typography variant="h6">
                      Next Task:{" "}
                      {nextTask ? TASK_CHOICES[nextTask.task_type] : "Empty"}
                    </Typography>
                    <Typography variant="h6">
                      Status: {nextTask ? nextTask.task_status : "Empty"}
                    </Typography>
                    <Typography
                      variant="h6"
                      component={Link}
                      to={
                        nextTask
                          ? nextTask.plant
                            ? "/plantDashboard/" + nextTask.plant
                            : "/condoDashboard"
                          : "/condoDashboard"
                      }
                    >
                      Plant Name:{" "}
                      {nextTask
                        ? nextTask.plant
                          ? nextTaskPlant
                            ? nextTaskPlant.plant_name
                            : "Empty"
                          : "Empty"
                        : "Empty"}
                    </Typography>
                    <Typography variant="h6">
                      Task Received on:{" "}
                      {nextTask
                        ? new Date(nextTask.task_date_time).toLocaleString(
                            "en-US",
                            {
                              timeZone: "US/Eastern",
                            }
                          )
                        : "Empty"}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
              <Divider /> <div style={{ height: "16px" }} />
              <Grid container justify="flex-end" alignItems="flex-end">
                <Grid item>
                  <Button
                    size="large"
                    variant="contained"
                    onClick={() => getAmbientData()}
                  >
                    <strong>Gather Ambient Data</strong>
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
export default CondoDashboard;
