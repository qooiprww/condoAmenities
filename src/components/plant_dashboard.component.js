import React, { useEffect } from "react";
import AmbientDataDataService from "../services/ambient_data.service";
import PlantDataDataService from "../services/plant_data.service";
import TaskDataService from "../services/task.service";
import PlantDataService from "../services/plant.service";
import SearchIcon from "@material-ui/icons/Search";
import JsmpegPlayer from "../JsmpegPlayer";
import { useHistory } from "react-router-dom";
import settings from "../settings";

import {
  Grid,
  CardContent,
  Box,
  Container,
  CardHeader,
  Card,
  Typography,
  Divider,
  Paper,
  InputBase,
  IconButton,
  Button,
  ListItem,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const PlantDashboard = ({ staticContext, ...props }) => {
  const [ambientData, setAmbientData] = React.useState([]);
  const [plantData, setPlantData] = React.useState([]);
  const [latestPlantData, setLatestPlantData] = React.useState("Empty");
  const [plant, setPlant] = React.useState("Empty");
  const [plants, setPlants] = React.useState([]);
  const [currentIndex, setCurrentIndex] = React.useState(-1);
  const [searchTitle, setSearchTitle] = React.useState("");

  const useStyles = makeStyles((theme) => ({
    root: {
      padding: theme.spacing(4),
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    search: {
      padding: "2px 4px",
      display: "flex",
      width: "100%",
    },
  }));
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();

  const formatXAxis = (tickItem) => {
    // If using moment.js
    return new Date(tickItem).toLocaleDateString("en-US", {
      timeZone: "US/Eastern",
    });
  };

  const onChangeSearchTitle = (e) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const refreshList = () => {
    retrievePlants();
    setCurrentIndex(-1);
  };

  const moveToPlant = () => {
    var data = {
      task_type: settings.TASK_MANUAL_CONTROL,
      plant: plant.id,
    };
    TaskDataService.create(data)
      .then((response) => {})
      .catch((e) => {
        console.log(e);
      });
  };
  const setActivePlant = (plant, index) => {
    history.push("/plantDashboard/" + plant.id);

    setCurrentIndex(index);
  };

  const retrievePlants = () => {
    PlantDataService.getAll()
      .then((response) => {
        setPlants(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const findByTitle = () => {
    var data = {
      plant_name: searchTitle,
    };
    PlantDataService.findByName(data)
      .then((response) => {
        setPlants(response.data);
      })
      .catch((e) => {
        console.log(e);
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

  const getPlantData = () => {
    var data = {
      task_type: settings.TASK_PLANT_DATA_GATHERING,
      plant: plant.id,
    };
    TaskDataService.create(data)
      .then((response) => {
        retrievePlantData(plant.id);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const setLightIntensity = () => {
    var data = {
      task_type: settings.TASK_LIGHTING_CONTROL,
      plant: plant.id,
    };
    TaskDataService.create(data)
      .then((response) => {
        retrievePlantData(plant.id);
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

  const retrievePlant = (id) => {
    PlantDataService.get(id)
      .then((response) => {
        setPlant(response.data);
        retrieveLatestPlantData(response.data.id);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const retrieveLatestPlantData = (id) => {
    PlantDataDataService.getLatest(id)
      .then((response) => {
        setLatestPlantData(response.data[0]);
      })
      .catch((e) => {
        setLatestPlantData(null);

        console.log(e);
      });
  };

  const retrievePlantData = (id) => {
    PlantDataDataService.get(id)
      .then((response) => {
        setPlantData(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    retrieveAmbientData();
    refreshList();
    retrievePlant(props.match.params.id);
    retrievePlantData(props.match.params.id);
  }, [props.match.params.id]);

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
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Card className={classes.root}>
              <Grid container spacing={4} alignItems="center" justify="center">
                <Grid item xs={6}>
                  <CardHeader title="Plants List"></CardHeader>
                </Grid>
                <Grid item xs={6}>
                  <Paper component="form" className={classes.search}>
                    <InputBase
                      className={classes.input}
                      placeholder="Search by name"
                      inputProps={{ "aria-label": "search plants" }}
                      value={searchTitle}
                      onChange={onChangeSearchTitle}
                    />
                    <IconButton
                      className={classes.iconButton}
                      aria-label="search"
                      onClick={findByTitle}
                    >
                      <SearchIcon />
                    </IconButton>
                  </Paper>
                </Grid>
              </Grid>

              <Divider />
              <CardContent>
                <div className={classes.form}>
                  {plants &&
                    plants.map((plant, index) => (
                      <ListItem
                        selected={index === currentIndex}
                        onClick={() => setActivePlant(plant, index)}
                        divider
                        button
                        key={index}
                      >
                        {plant.plant_name}
                      </ListItem>
                    ))}
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Card className={classes.root}>
              <CardHeader title="Plant Coordinate" />
              <Divider />
              <CardContent>
                <Grid container justify="space-between">
                  <Grid item>
                    <Typography variant="h6">
                      Plant Name: {plant ? plant.plant_name : "Empty"}
                    </Typography>
                    <Typography variant="h6">
                      Plant Degree: {plant ? plant.degree : "Empty"}
                    </Typography>
                    <Typography variant="h6">
                      Plant Radius: {plant ? plant.radius : "Empty"}
                    </Typography>
                    <Typography variant="h6">
                      Plant Level: {plant ? plant.level : "Empty"}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
              <Divider /> <div style={{ height: "16px" }} />
              <Grid
                container
                justify="space-between"
                alignItems="center"
                spacing={3}
              >
                <Grid item xs={6}>
                  <Button
                    size="large"
                    variant="contained"
                    onClick={() => setLightIntensity()}
                  >
                    <strong>Set Desired Light</strong>
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    size="large"
                    variant="contained"
                    onClick={() => moveToPlant()}
                  >
                    <strong>Move to Plant</strong>
                  </Button>
                </Grid>
              </Grid>
            </Card>{" "}
            <div style={{ height: "16px" }} />
            <Card className={classes.root}>
              <CardHeader title="Soil Humidity" />
              <Divider />
              <CardContent>
                <Grid container justify="space-between">
                  <Grid item>
                    <Typography variant="h4">
                      {latestPlantData ? latestPlantData.humidity : "0"}%
                    </Typography>
                    <Typography variant="h6">
                      Data retrieved on:{" "}
                      {latestPlantData
                        ? new Date(
                            latestPlantData.plant_data_date_time
                          ).toLocaleString("en-US", {
                            timeZone: "US/Eastern",
                          })
                        : "Never"}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
              <Divider /> <div style={{ height: "16px" }} />
              <Grid
                container
                justify="flex-end"
                alignItems="flex-end"
                spacing={3}
              >
                <Grid item>
                  <Button
                    size="large"
                    variant="contained"
                    onClick={() => getPlantData()}
                  >
                    <strong>Gather Plant Data</strong>
                  </Button>
                </Grid>
              </Grid>
            </Card>{" "}
            <div style={{ height: "16px" }} />
            <Card className={classes.root}>
              <CardHeader title="Live Stream" />
              <Divider />
              <CardContent>
                <Grid container justify="space-between">
                  <Grid item>
                    <img
                      src="http://192.168.0.164:8081"
                      height="100%"
                      width="100%"
                    />
                    {/* <video controls muted>
                      <source
                        src="http://192.168.0.164:8081"
                        type="video/webm"
                      ></source>
                    </video> */}
                    {/* <JsmpegPlayer
                      wrapperClassName="video-wrapper"
                      videoUrl="rtsp://ubuntu:Jb35cm@192.168.0.165:8080/video"
                      data-loop="true"
                      data-autoplay="true"
                    /> */}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item lg={6} sm={12} xl={6} xs={12}>
            <Card {...props}>
              <CardHeader title="Soil Humidity" /> <Divider />
              <CardContent>
                <ResponsiveContainer width="100%" height={120}>
                  <AreaChart
                    data={plantData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="plant_data_date_time"
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
                      dataKey="humidity"
                      stroke="#775447"
                      fill="#775447"
                    />
                  </AreaChart>
                </ResponsiveContainer>{" "}
              </CardContent>
            </Card>
            <div style={{ height: "16px" }} />
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
        </Grid>
      </Container>
    </Box>
  );
};
export default PlantDashboard;
