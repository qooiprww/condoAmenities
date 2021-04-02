import React, { useEffect } from "react";
import PlantTypeDataService from "../services/plant_type.service";
import SeedContainerDataService from "../services/seed_container.service";
import SearchIcon from "@material-ui/icons/Search";

import {
  TextField,
  Button,
  Grid,
  ListItem,
  InputBase,
  IconButton,
  Paper,
  Divider,
  CardContent,
  CardHeader,
  Card,
  Select,
  InputLabel,
  FormControl,
} from "@material-ui/core";
import settings from "../settings";
import { makeStyles } from "@material-ui/core";

const PlantType = () => {
  const initialPlantTypeState = {
    id: null,
    plant_type_name: "",
    growing_radius: "",
    seed_container: "",
    desired_humidity: "",
    desired_light_red: "",
    desired_light_green: "",
    desired_light_blue: "",
    desired_temperature: "",
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
  }));

  const [plant_types, setPlantTypes] = React.useState([]);
  const [currentPlantType, setCurrentPlantType] = React.useState(
    initialPlantTypeState
  );
  const [currentIndex, setCurrentIndex] = React.useState(-1);
  const [searchTitle, setSearchTitle] = React.useState("");
  const [seed_containers, setSeedContainers] = React.useState([]);

  const [plant_type, setPlantType] = React.useState(initialPlantTypeState);

  const humidityError =
    plant_type.desired_humidity > 100.0 ||
    plant_type.desired_humidity < 0.0 ||
    plant_type.desired_humidity == null;

  const radiusError =
    plant_type.growing_radius > settings.MAX_RADIUS ||
    plant_type.growing_radius < 0.0 ||
    plant_type.growing_radius == null;

  const temperatureError =
    plant_type.desired_temperature > 70.0 ||
    plant_type.desired_temperature < -50.0 ||
    plant_type.desired_temperature == null;

  const redError =
    plant_type.desired_light_red > 255 ||
    plant_type.desired_light_red < 0 ||
    plant_type.desired_light_red == null;

  const greenError =
    plant_type.desired_light_green > 255 ||
    plant_type.desired_light_green < 0.0 ||
    plant_type.desired_light_green == null;

  const blueError =
    plant_type.desired_light_blue > 255 ||
    plant_type.desired_light_blue < 0.0 ||
    plant_type.desired_light_blue == null;

  const nameError =
    plant_type.plant_type_name == null ||
    plant_type.plant_type_name.toString().length > 255;

  const classes = useStyles();

  useEffect(() => {
    retrieveSeedContainers();
    retrievePlantTypes();
  }, [plant_type]);

  const onChangeSearchTitle = (e) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const refreshList = () => {
    retrievePlantTypes();
    setCurrentPlantType(initialPlantTypeState);
    setPlantType(initialPlantTypeState);
    setCurrentIndex(-1);
  };

  const setActivePlantType = (plantType, index) => {
    setCurrentPlantType(plantType);
    setPlantType(plantType);
    setCurrentIndex(index);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPlantType({ ...plant_type, [name]: value });
  };

  const retrieveSeedContainers = () => {
    SeedContainerDataService.getAll()
      .then((response) => {
        setSeedContainers(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const retrievePlantTypes = () => {
    PlantTypeDataService.getAll()
      .then((response) => {
        setPlantTypes(response.data);
        console.log(response.data);
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
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const updatePlantType = () => {
    var data = {
      plant_type_name: plant_type.plant_type_name,
      growing_radius: plant_type.growing_radius,
      seed_container: plant_type.seed_container,
      desired_humidity: plant_type.desired_humidity,
      desired_light_red: plant_type.desired_light_red,
      desired_light_green: plant_type.desired_light_green,
      desired_light_blue: plant_type.desired_light_blue,
      desired_temperature: plant_type.desired_temperature,
    };

    PlantTypeDataService.update(currentPlantType.id, data)
      .then((response) => {
        setPlantType({
          plant_type_name: response.data.plant_type_name,
          growing_radius: response.data.growing_radius,
          seed_container: response.data.seed_container,
          desired_humidity: response.data.desired_humidity,
          desired_light_red: response.data.desired_light_red,
          desired_light_green: response.data.desired_light_green,
          desired_light_blue: response.data.desired_light_blue,
          desired_temperature: response.data.desired_temperature,
        });
        console.log(response.data);
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const savePlantType = () => {
    var data = {
      plant_type_name: plant_type.plant_type_name,
      growing_radius: plant_type.growing_radius,
      seed_container: plant_type.seed_container,
      desired_humidity: plant_type.desired_humidity,
      desired_light_red: plant_type.desired_light_red,
      desired_light_green: plant_type.desired_light_green,
      desired_light_blue: plant_type.desired_light_blue,
      desired_temperature: plant_type.desired_temperature,
    };

    PlantTypeDataService.create(data)
      .then((response) => {
        setPlantType({
          id: response.data.id,
          plant_type_name: response.data.plant_type_name,
          growing_radius: response.data.growing_radius,
          seed_container: response.data.seed_container,
          desired_humidity: response.data.desired_humidity,
          desired_light_red: response.data.desired_light_red,
          desired_light_green: response.data.desired_light_green,
          desired_light_blue: response.data.desired_light_blue,
          desired_temperature: response.data.desired_temperature,
        });
        console.log(response.data);
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const removeAllPlantTypes = () => {
    PlantTypeDataService.deleteAll()
      .then((response) => {
        console.log(response.data);
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deletePlantType = () => {
    PlantTypeDataService.delete(currentPlantType.id)
      .then((response) => {
        console.log(response.data);

        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <React.Fragment>
      <div>
        <Grid container spacing={4} alignItems="flex-start">
          <Grid item xs={6}>
            <Card className={classes.root}>
              <Grid container spacing={4} alignItems="center" justify="center">
                <Grid item xs={6}>
                  <CardHeader title="Plant Type List"></CardHeader>
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
                        onClick={() => setActivePlantType(plantType, index)}
                        divider
                        button
                        key={index}
                      >
                        {plantType.plant_type_name}
                      </ListItem>
                    ))}
                </div>
              </CardContent>
              <Divider /> <div style={{ height: "16px" }} />
              <Grid container justify="flex-end" alignItems="flex-end">
                <Grid item>
                  <Button
                    size="large"
                    variant="contained"
                    onClick={() => removeAllPlantTypes()}
                  >
                    <strong>Remove All</strong>
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card className={classes.root}>
              <CardHeader title="Plant Type Details"></CardHeader>
              <Divider />
              <CardContent>
                <div className="form-group">
                  <TextField
                    label="Name"
                    className="form-control"
                    name="plant_type_name"
                    value={plant_type.plant_type_name}
                    onChange={handleInputChange}
                    error={nameError}
                    style={{ width: "100%" }}
                    variant="filled"
                    helperText={
                      nameError
                        ? "Name needs to be shorter than 255 characters "
                        : "Perfect!"
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <TextField
                    type={"number"}
                    className="form-control"
                    label="Growing Radius (cm)"
                    name="growing_radius"
                    value={plant_type.growing_radius}
                    onChange={handleInputChange}
                    error={radiusError}
                    style={{ width: "100%" }}
                    variant="filled"
                    helperText={
                      radiusError
                        ? "Radius needs to be between 0.0 and " +
                          settings.MAX_RADIUS.toString()
                        : "Perfect!"
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <TextField
                    type={"number"}
                    className="form-control"
                    label="Desired Humidity (%)"
                    name="desired_humidity"
                    value={plant_type.desired_humidity}
                    onChange={handleInputChange}
                    error={humidityError}
                    style={{ width: "100%" }}
                    variant="filled"
                    helperText={
                      humidityError
                        ? "Humidity needs to be between 0.0 and 100.0"
                        : "Perfect!"
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <TextField
                    type={"number"}
                    className="form-control"
                    label="Desired Light Red"
                    name="desired_light_red"
                    value={plant_type.desired_light_red}
                    onChange={handleInputChange}
                    error={redError}
                    style={{ width: "100%" }}
                    variant="filled"
                    helperText={
                      redError
                        ? "Color needs to be between 0 and 255"
                        : "Perfect!"
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <TextField
                    type={"number"}
                    className="form-control"
                    label="Desired Light Green"
                    name="desired_light_green"
                    value={plant_type.desired_light_green}
                    onChange={handleInputChange}
                    error={greenError}
                    style={{ width: "100%" }}
                    variant="filled"
                    helperText={
                      greenError
                        ? "Color needs to be between 0 and 255"
                        : "Perfect!"
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <TextField
                    type={"number"}
                    className="form-control"
                    label="Desired Light Blue"
                    name="desired_light_blue"
                    value={plant_type.desired_light_blue}
                    onChange={handleInputChange}
                    error={blueError}
                    style={{ width: "100%" }}
                    variant="filled"
                    helperText={
                      blueError
                        ? "Color needs to be between 0 and 255"
                        : "Perfect!"
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <TextField
                    type={"number"}
                    className="form-control"
                    label="Desired Temperature (°C)"
                    name="desired_temperature"
                    value={plant_type.desired_temperature}
                    onChange={handleInputChange}
                    error={temperatureError}
                    style={{ width: "100%" }}
                    variant="filled"
                    helperText={
                      temperatureError
                        ? "Color needs to be between -50.0 and 70.0"
                        : "Perfect!"
                    }
                    required
                  />
                </div>
                <FormControl
                  variant="filled"
                  style={{ width: "100%" }}
                  className={classes.formControl}
                >
                  <InputLabel htmlFor="filled-age-native-simple">
                    Seed Container
                  </InputLabel>
                  <Select
                    label="Seed Container"
                    name="seed_container"
                    className="form-control"
                    required
                    onChange={handleInputChange}
                    value={plant_type.seed_container}
                    inputProps={{
                      id: "filled-age-native-simple",
                    }}
                  >
                    {seed_containers.map((item) => {
                      return (
                        <option key={item.id} value={item.id}>
                          {item.seed_container_name}
                        </option>
                      );
                    })}
                  </Select>
                </FormControl>
                <div style={{ height: "20px" }} />
                <Grid
                  container
                  alignItems="center"
                  justify="center"
                  spacing={4}
                >
                  <Grid item>
                    <Button
                      size="large"
                      type="Create"
                      variant="contained"
                      disabled={
                        blueError ||
                        radiusError ||
                        greenError ||
                        redError ||
                        humidityError ||
                        temperatureError ||
                        nameError
                      }
                      onClick={savePlantType}
                    >
                      <strong>Create</strong>
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      size="large"
                      type="Update"
                      variant="contained"
                      disabled={
                        blueError ||
                        radiusError ||
                        greenError ||
                        redError ||
                        humidityError ||
                        temperatureError ||
                        nameError ||
                        !currentPlantType.id
                      }
                      onClick={updatePlantType}
                    >
                      <strong>Update</strong>
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      size="large"
                      type="Delete"
                      variant="contained"
                      disabled={!currentPlantType.id}
                      onClick={deletePlantType}
                    >
                      <strong>Delete</strong>
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
};
export default PlantType;
