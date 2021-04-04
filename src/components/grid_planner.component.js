import React, { useEffect } from "react";
import PlantTypeDataService from "../services/plant_type.service";
import SearchIcon from "@material-ui/icons/Search";
import math from "math";
import {
  MapContainer,
  Circle,
  Polyline,
  Polygon,
  Marker,
  Popup,
  ImageOverlay,
} from "react-leaflet";
import L, { CRS } from "leaflet";

//import Marker from "react-leaflet-enhanced-marker";
import CheckIcon from "@material-ui/icons/Check";
import PlantDataService from "../services/plant.service";
import TaskDataService from "../services/task.service";

import {
  Grid,
  ListItem,
  InputBase,
  IconButton,
  Paper,
  Divider,
  CardContent,
  CardHeader,
  Card,
  FormControl,
  Select,
  InputLabel,
  TextField,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import settings from "../settings";

let DefaultIcon = L.icon({
  iconUrl: "marker.png",
  shadowUrl: "marker.png",
  iconAnchor: [10, 10],
  iconSize: [20, 20],
  shadowSize: [20, 20],
});

const GridPlanner = () => {
  const [plant_types, setPlantTypes] = React.useState([]);
  const [searchTitle, setSearchTitle] = React.useState("");
  const [currentIndex, setCurrentIndex] = React.useState(-1);
  const [currentMarkerIndex, setCurrentMarkerIndex] = React.useState(-1);
  const [level, setLevel] = React.useState(1);
  const [plants, setPlants] = React.useState([]);
  const [newPlants, setNewPlants] = React.useState([]);
  const itemsRef = React.useRef([]);

  const radius = 400;
  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, newPlants.length);
  }, [newPlants, currentMarkerIndex]);

  useEffect(() => {
    retrievePlantTypesAndPlants();
  }, []);

  const addPlant = (plant_type_id) => {
    const data = {
      plant_name: "New Plant",
      plant_type: plant_type_id,
      degree: 135.0,
      radius: 40,
      level: level,
      harvested: false,
      planted: false,
    };
    console.log(data);
    setNewPlants((arr) => [...arr, data]);
  };

  const eventHandlers = (index) => ({
    drag() {
      const marker = itemsRef.current[index];
      if (marker != null) {
        let newArr = [...newPlants]; // copying the old datas array
        let Ccoords = marker.getLatLng();
        let Pcoords = XYtoDR(Ccoords["lng"], Ccoords["lat"]);
        console.log(Pcoords);

        var newData = {
          plant_name: "New Plant",
          plant_type: newArr[index].plant_type,
          degree: Pcoords[0],
          radius: Pcoords[1],
          level: level,
          harvested: false,
          planted: false,
        };
        newArr[index] = newData;
        setNewPlants(newArr);
      }
    },
    dragend() {
      const marker = itemsRef.current[index];
      if (marker != null) {
        let newArr = [...newPlants]; // copying the old datas array
        let Ccoords = marker.getLatLng();
        let Pcoords = XYtoDR(Ccoords["lng"], Ccoords["lat"]);
        console.log(Pcoords);

        var newData = {
          plant_name: "New Plant",
          plant_type: newArr[index].plant_type,
          degree: Pcoords[0],
          radius: Pcoords[1],
          level: level,
          harvested: false,
          planted: false,
        };
        newArr[index] = newData;
        setNewPlants(newArr);
      }
    },
  });

  const handleNewPlantChange = (itemName, index) => {
    setNewPlants(
      newPlants.map((plant, i) =>
        i === index ? { ...plant, plant_name: itemName } : plant
      )
    );
  };
  const handlePlantChange = (itemName, index) => {
    setPlants(
      plants.map((plant, i) =>
        i === index ? { ...plant, plant_name: itemName } : plant
      )
    );
  };

  const updatePlant = (itemName, index) => {
    var data = {
      plant_name: itemName,
      plant_type: plants[index].plant_type,
      degree: plants[index].degree,
      radius: plants[index].radius,
      level: plants[index].level,
      harvested: plants[index].harvested,
      planted: plants[index].planted,
    };

    PlantDataService.update(plants[index].id, data)
      .then((response) => {
        retrievePlantTypesAndPlants();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const plantPlants = () => {
    newPlants.map((newPlant) => {
      var data = {
        plant_name: newPlant.plant_name,
        plant_type: newPlant.plant_type,
        degree: newPlant.degree,
        radius: newPlant.radius,
        level: newPlant.level,
        harvested: newPlant.harvested,
        planted: newPlant.planted,
      };
      PlantDataService.create(data)
        .then((response) => {
          retrievePlantTypesAndPlants();
          var data = {
            task_type: settings.TASK_SEEDING,
            plant: response.data.id,
          };
          TaskDataService.create(data)
            .then((response) => {})
            .catch((e) => {
              console.log(e);
            });
        })
        .catch((e) => {
          console.log(e);
        });
      return true;
    });
  };

  const retrievePlantTypesAndPlants = () => {
    PlantTypeDataService.getAll()
      .then((response) => {
        setPlantTypes(response.data);
        PlantDataService.getAll()
          .then((response) => {
            setPlants(response.data);
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const findByTitle = () => {
    var data = {
      plant_type_name: searchTitle,
    };
    PlantTypeDataService.findByName(data)
      .then((response) => {
        setPlantTypes(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const onChangeSearchTitle = (e) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };
  const setActivePlantType = (plantType, index) => {
    setCurrentIndex(index);
    addPlant(plantType.id);
    setCurrentMarkerIndex(newPlants.length);
  };

  const DRtoXY = (cordDegree, cordRadius) => {
    return [
      (math.sin((cordDegree * math.PI) / 180.0) * cordRadius * radius) /
        settings.MAX_RADIUS +
        radius,
      (math.cos((cordDegree * math.PI) / 180.0) * cordRadius * radius) /
        settings.MAX_RADIUS +
        radius,
    ];
  };
  const XYtoDR = (cordX, cordY) => {
    if (
      cordX - radius < radius &&
      cordX - radius > (-13 * radius) / settings.MAX_RADIUS &&
      cordY - radius < (13 * radius) / settings.MAX_RADIUS &&
      cordY - radius > (-6.5 * radius) / settings.MAX_RADIUS
    ) {
      cordX = DRtoXY(135, 40)[1];
      cordY = DRtoXY(135, 40)[0];
    }
    if ((cordX - radius) ** 2 + (cordY - radius) ** 2 >= radius ** 2) {
      cordX = DRtoXY(135, 40)[1];
      cordY = DRtoXY(135, 40)[0];
    }
    return [
      cordX - radius < 0
        ? ((math.atan((cordY - radius) / (cordX - radius)) + math.PI) * 180) /
          math.PI
        : cordY - radius < 0
        ? ((math.atan((cordY - radius) / (cordX - radius)) + 2 * math.PI) *
            180) /
          math.PI
        : (math.atan((cordY - radius) / (cordX - radius)) * 180) / math.PI,
      (math.sqrt((cordX - radius) ** 2 + (cordY - radius) ** 2) *
        settings.MAX_RADIUS) /
        radius,
    ];
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      padding: theme.spacing(4),
    },
    form: {
      width: "100%",
      maxWidth: 800,
    },
    search: {
      padding: "2px 4px",
      display: "flex",
      width: "100%",
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
    grid: { width: "100%", height: "800px" },
  }));
  const classes = useStyles();
  const fillSoilOptions = { fill: false, color: "#bcaaa4" };
  const circleGridOptions = { fill: false, color: "#bcaaa4", weight: 1 };
  const plantOptions = {
    fillColor: "#fb8c00",
    color: "#fb8c00",
    weight: 3,
  };
  const newPlantOptions = {
    fillColor: "#76ff03",
    color: "#76ff03",
    weight: 3,
  };
  const bannedGridOptions = {
    fill: false,
    color: "#bcaaa4",
    weight: 6,
    fillOpacity: 1,
  };
  const circleGrids = [5, 10, 15, 20, 25, 30];
  const bannedGrid = [
    [
      radius + (13 * radius) / settings.MAX_RADIUS,
      radius - (13 * radius) / settings.MAX_RADIUS,
    ],

    [radius - (6.5 * radius) / settings.MAX_RADIUS, 2 * radius],
  ];
  const bannedGridOutline = [
    [radius + (13 * radius) / settings.MAX_RADIUS, 2 * radius - 35],
    [
      radius + (13 * radius) / settings.MAX_RADIUS,
      radius - (13 * radius) / settings.MAX_RADIUS,
    ],
    [
      radius - (6.5 * radius) / settings.MAX_RADIUS,
      radius - (13 * radius) / settings.MAX_RADIUS,
    ],
    [radius - (6.5 * radius) / settings.MAX_RADIUS, 2 * radius - 9],
  ];
  const gridOptions = { color: "#bcaaa4", weight: 2 };
  const gridData = [
    [
      [0, radius],
      [radius * 2, radius],
    ],
    [
      [radius, 0],
      [radius, radius * 2],
    ],
  ];
  const microGridOptions = { color: "#bcaaa4", weight: 1 };
  const microGridData = [
    [
      [radius + radius / math.sqrt(2), radius + radius / math.sqrt(2)],
      [radius - radius / math.sqrt(2), radius - radius / math.sqrt(2)],
    ],
    [
      [radius + radius / math.sqrt(2), radius - radius / math.sqrt(2)],
      [radius - radius / math.sqrt(2), radius + radius / math.sqrt(2)],
    ],
    [
      [radius + radius / math.sqrt(2), radius + radius / math.sqrt(2)],
      [radius - radius / math.sqrt(2), radius - radius / math.sqrt(2)],
    ],
    [
      [radius + radius / math.sqrt(2), radius - radius / math.sqrt(2)],
      [radius - radius / math.sqrt(2), radius + radius / math.sqrt(2)],
    ],
    [
      [
        radius + radius * math.cos(math.PI / 6),
        radius + radius * math.sin(math.PI / 6),
      ],
      [
        radius - radius * math.cos(math.PI / 6),
        radius - radius * math.sin(math.PI / 6),
      ],
    ],
    [
      [
        radius + radius * math.cos(math.PI / 6),
        radius - radius * math.sin(math.PI / 6),
      ],
      [
        radius - radius * math.cos(math.PI / 6),
        radius + radius * math.sin(math.PI / 6),
      ],
    ],
    [
      [
        radius + radius * math.cos(math.PI / 3),
        radius + radius * math.sin(math.PI / 3),
      ],
      [
        radius - radius * math.cos(math.PI / 3),
        radius - radius * math.sin(math.PI / 3),
      ],
    ],
    [
      [
        radius + radius * math.cos(math.PI / 3),
        radius - radius * math.sin(math.PI / 3),
      ],
      [
        radius - radius * math.cos(math.PI / 3),
        radius + radius * math.sin(math.PI / 3),
      ],
    ],
    [
      [
        radius + radius * math.cos(math.PI / 12),
        radius + radius * math.sin(math.PI / 12),
      ],
      [
        radius - radius * math.cos(math.PI / 12),
        radius - radius * math.sin(math.PI / 12),
      ],
    ],
    [
      [
        radius + radius * math.cos(math.PI / 12),
        radius - radius * math.sin(math.PI / 12),
      ],
      [
        radius - radius * math.cos(math.PI / 12),
        radius + radius * math.sin(math.PI / 12),
      ],
    ],
    [
      [
        radius + radius * math.cos((math.PI * 5) / 12),
        radius + radius * math.sin((math.PI * 5) / 12),
      ],
      [
        radius - radius * math.cos((math.PI * 5) / 12),
        radius - radius * math.sin((math.PI * 5) / 12),
      ],
    ],
    [
      [
        radius + radius * math.cos((math.PI * 5) / 12),
        radius - radius * math.sin((math.PI * 5) / 12),
      ],
      [
        radius - radius * math.cos((math.PI * 5) / 12),
        radius + radius * math.sin((math.PI * 5) / 12),
      ],
    ],
  ];

  return (
    <React.Fragment>
      <div>
        <Grid container spacing={4} alignItems="flex-start">
          <Grid item xs={4}>
            <Card className={classes.root}>
              <Grid container spacing={4} alignItems="center" justify="center">
                <Grid item xs={6}>
                  <CardHeader title="Click To Add Plant"></CardHeader>
                </Grid>
                <Grid item xs={6}>
                  <Paper component="form" className={classes.search}>
                    <InputBase
                      className={classes.input}
                      placeholder="Search by name"
                      inputProps={{ "aria-label": "search plant type" }}
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
                  {plant_types &&
                    plant_types.map((plantType, index) => (
                      <ListItem
                        selected={index === currentIndex}
                        onClick={(e) => setActivePlantType(plantType, index)}
                        divider
                        button
                        value={plantType.id}
                        key={index}
                      >
                        {plantType.plant_type_name}
                      </ListItem>
                    ))}
                </div>
              </CardContent>
            </Card>
            <div style={{ height: "16px" }} />
            <Card className={classes.root}>
              <CardHeader title="Live Stream" />
              <Divider />
              <CardContent>
                <Grid container justify="space-between">
                  <Grid item>
                    <img
                      src="http://192.168.0.164:8081"
                      width="100%"
                      alt="Camera is offline"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={8}>
            <Card className={classes.root}>
              <Grid
                container
                spacing={4}
                alignItems="flex-start"
                justify="flex-end"
              >
                <Grid item xs={8}>
                  <CardHeader title="Grid Planner"></CardHeader>
                </Grid>
                <Grid item xs={3}>
                  <FormControl
                    variant="filled"
                    style={{ width: "100%" }}
                    className={classes.formControl}
                  >
                    <InputLabel htmlFor="filled-age-native-simple">
                      Level
                    </InputLabel>
                    <Select
                      label="Level"
                      name="level"
                      className="form-control"
                      required
                      defaultValue={1}
                      onChange={(e) => setLevel(e.target.value)}
                      value={level}
                      inputProps={{
                        id: "filled-age-native-simple",
                      }}
                    >
                      <option value={1}>Plant Level 1</option>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={1}>
                  <Button
                    size="large"
                    variant="contained"
                    onClick={() => plantPlants()}
                  >
                    <strong>Plant!</strong>
                  </Button>
                </Grid>
              </Grid>{" "}
              <Divider />
              <CardContent>
                <MapContainer
                  style={{
                    width: "100%",
                    height: "80vh",
                  }}
                  center={[radius, radius]}
                  zoom={0}
                  maxZoom={3}
                  className={classes.grid}
                  zoomControl={false}
                  boxZoom={false}
                  crs={CRS.Simple}
                  attributionControl={false}
                  maxBounds={[
                    [-500, -500],
                    [1300, 1300],
                  ]}
                  maxBoundsViscosity={1}
                >
                  <ImageOverlay
                    url="soil.jpg"
                    bounds={[
                      [-500, -500],
                      [1300, 1300],
                    ]}
                  ></ImageOverlay>
                  {plants.map((item, index) => {
                    return (
                      <div key={index}>
                        <Marker
                          icon={DefaultIcon}
                          position={DRtoXY(item.degree, item.radius)}
                          draggable={false}
                        >
                          <Popup minWidth="200" maxHeight="auto">
                            <Paper component="form" className={classes.search}>
                              <InputBase
                                placeholder="Name"
                                className={classes.input}
                                name="plant_type_name"
                                value={item.plant_name}
                                onChange={(e) =>
                                  handlePlantChange(e.target.value, index)
                                }
                                error={
                                  item.plant_name == null ||
                                  item.plant_name.toString().length > 255
                                }
                                style={{ width: "100%" }}
                                required
                              />
                              <IconButton
                                className={classes.iconButton}
                                aria-label="menu"
                                onClick={(e) =>
                                  updatePlant(item.plant_name, index)
                                }
                              >
                                <CheckIcon />
                              </IconButton>
                            </Paper>
                            Type:
                            {plant_types[item.plant_type - 1].plant_type_name}
                          </Popup>
                        </Marker>
                        <Circle
                          center={DRtoXY(item.degree, item.radius)}
                          pathOptions={plantOptions}
                          radius={
                            (plant_types[item.plant_type - 1].growing_radius *
                              radius) /
                            settings.MAX_RADIUS
                          }
                        />
                      </div>
                    );
                  })}
                  {newPlants.map((item, index) => {
                    return (
                      <div key={index}>
                        <Marker
                          icon={DefaultIcon}
                          position={DRtoXY(item.degree, item.radius)}
                          draggable={true}
                          eventHandlers={eventHandlers(index)}
                          ref={(el) => (itemsRef.current[index] = el)}
                        >
                          <Popup>
                            <div className="form-group">
                              <TextField
                                label="Name"
                                className="form-control"
                                name="plant_type_name"
                                value={item.plant_name}
                                onChange={(e) =>
                                  handleNewPlantChange(e.target.value, index)
                                }
                                error={
                                  item.plant_name == null ||
                                  item.plant_name.toString().length > 255
                                }
                                style={{ width: "100%" }}
                                helperText={
                                  item.plant_name == null ||
                                  item.plant_name.toString().length > 255
                                    ? "Name needs to be shorter than 255 characters "
                                    : "Perfect!"
                                }
                                required
                              />
                            </div>{" "}
                            <br /> Type:
                            {plant_types[item.plant_type - 1].plant_type_name}
                          </Popup>
                        </Marker>
                        <Circle
                          center={DRtoXY(item.degree, item.radius)}
                          pathOptions={newPlantOptions}
                          radius={
                            (plant_types[item.plant_type - 1].growing_radius *
                              radius) /
                            settings.MAX_RADIUS
                          }
                        />
                      </div>
                    );
                  })}
                  <Circle
                    center={[radius, radius]}
                    pathOptions={fillSoilOptions}
                    radius={radius}
                  />
                  {circleGrids.map((item) => {
                    return (
                      <Circle
                        center={[radius, radius]}
                        pathOptions={circleGridOptions}
                        radius={(item * radius) / settings.MAX_RADIUS}
                        key={item}
                      />
                    );
                  })}
                  <Polyline pathOptions={gridOptions} positions={gridData} />
                  <Polyline
                    pathOptions={microGridOptions}
                    positions={microGridData}
                  />{" "}
                  <Polygon
                    pathOptions={bannedGridOptions}
                    positions={bannedGrid}
                  />
                  <Polyline
                    pathOptions={bannedGridOptions}
                    positions={bannedGridOutline}
                  />
                  <ImageOverlay
                    url="patch.jpg"
                    bounds={bannedGrid}
                    zIndex={200}
                  ></ImageOverlay>
                </MapContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
};
export default GridPlanner;
