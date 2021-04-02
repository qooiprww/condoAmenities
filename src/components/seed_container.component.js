import React, { useEffect } from "react";
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
  InputAdornment,
  useTheme,
} from "@material-ui/core";
import settings from "../settings";
import { makeStyles } from "@material-ui/core";

const SeedContainer = () => {
  const initialSeedContainerState = {
    id: null,
    seed_container_name: "",
    seed_container_degree: "",
    seed_container_radius: "",
    seed_container_level: "",

    submitted: false,
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

  const [seed_containers, setSeedContainers] = React.useState([]);
  const [currentSeedContainer, setCurrentSeedContainer] = React.useState(
    initialSeedContainerState
  );
  const [currentIndex, setCurrentIndex] = React.useState(-1);
  const [searchTitle, setSearchTitle] = React.useState("");

  const [seed_container, setSeedContainer] = React.useState(
    initialSeedContainerState
  );

  const [submitted, setSubmitted] = React.useState(false);

  const degreeError =
    seed_container.seed_container_degree >= 360.0 ||
    seed_container.seed_container_degree < 0.0 ||
    seed_container.seed_container_degree == null;

  const radiusError =
    seed_container.seed_container_radius > settings.MAX_RADIUS ||
    seed_container.seed_container_radius < 0.0 ||
    seed_container.seed_container_radius == null;

  const levelError =
    seed_container.seed_container_level > settings.MAX_LEVEL ||
    seed_container.seed_container_level < 0.0 ||
    seed_container.seed_container_level == null;

  const nameError =
    seed_container.seed_container_name == null ||
    seed_container.seed_container_name.toString().length > 255;

  const classes = useStyles();

  useEffect(() => {
    retrieveSeedContainers();
  }, [seed_container]);

  const onChangeSearchTitle = (e) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const refreshList = () => {
    retrieveSeedContainers();
    setCurrentSeedContainer(initialSeedContainerState);
    setSeedContainer(initialSeedContainerState);
    setCurrentIndex(-1);
  };

  const setActiveSeedContainer = (seedContainer, index) => {
    setCurrentSeedContainer(seedContainer);
    setSeedContainer(seedContainer);
    setCurrentIndex(index);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSeedContainer({ ...seed_container, [name]: value });
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

  const findByTitle = () => {
    var data = {
      seed_container_name: searchTitle,
    };
    SeedContainerDataService.findByName(data)
      .then((response) => {
        setSeedContainers(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const updateSeedContainer = () => {
    var data = {
      seed_container_name: seed_container.seed_container_name,
      seed_container_degree: seed_container.seed_container_degree,
      seed_container_radius: seed_container.seed_container_radius,
      seed_container_level: seed_container.seed_container_level,
    };

    SeedContainerDataService.update(currentSeedContainer.id, data)
      .then((response) => {
        setSeedContainer({
          seed_container_name: response.data.seed_container_name,
          seed_container_degree: response.data.seed_container_degree,
          seed_container_radius: response.data.seed_container_radius,
          seed_container_level: response.data.seed_container_level,
        });
        setSubmitted(true);
        console.log(response.data);
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const saveSeedContainer = () => {
    var data = {
      seed_container_name: seed_container.seed_container_name,
      seed_container_degree: seed_container.seed_container_degree,
      seed_container_radius: seed_container.seed_container_radius,
      seed_container_level: seed_container.seed_container_level,
    };

    SeedContainerDataService.create(data)
      .then((response) => {
        setSeedContainer({
          id: response.data.id,
          seed_container_name: response.data.seed_container_name,
          seed_container_degree: response.data.seed_container_degree,
          seed_container_radius: response.data.seed_container_radius,
          seed_container_level: response.data.seed_container_level,
        });
        setSubmitted(true);
        console.log(response.data);
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const removeAllSeedContainers = () => {
    SeedContainerDataService.deleteAll()
      .then((response) => {
        console.log(response.data);
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteSeedContainer = () => {
    SeedContainerDataService.delete(currentSeedContainer.id)
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
                  <CardHeader title="Seed Containers List"></CardHeader>
                </Grid>
                <Grid item xs={6}>
                  <Paper component="form" className={classes.search}>
                    <InputBase
                      className={classes.input}
                      placeholder="Search by name"
                      inputProps={{ "aria-label": "search seed containers" }}
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
                  {seed_containers &&
                    seed_containers.map((seedContainer, index) => (
                      <ListItem
                        selected={index === currentIndex}
                        onClick={() =>
                          setActiveSeedContainer(seedContainer, index)
                        }
                        divider
                        button
                        key={index}
                      >
                        {seedContainer.seed_container_name}
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
                    onClick={() => removeAllSeedContainers()}
                  >
                    <strong>Remove All</strong>
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card className={classes.root}>
              <CardHeader title="Seed Container Details"></CardHeader>
              <Divider />
              <CardContent>
                <div className="form-group">
                  <TextField
                    label="Name"
                    className="form-control"
                    name="seed_container_name"
                    value={seed_container.seed_container_name}
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
                    label="Degree (°)"
                    name="seed_container_degree"
                    value={seed_container.seed_container_degree}
                    onChange={handleInputChange}
                    error={degreeError}
                    style={{ width: "100%" }}
                    variant="filled"
                    helperText={
                      degreeError
                        ? "Degree needs to be between 0.0 and 360.0"
                        : "Perfect!"
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <TextField
                    type={"number"}
                    className="form-control"
                    label="Radius (cm)"
                    name="seed_container_radius"
                    value={seed_container.seed_container_radius}
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
                    label="Level"
                    name="seed_container_level"
                    value={seed_container.seed_container_level}
                    onChange={handleInputChange}
                    error={levelError}
                    style={{ width: "100%" }}
                    variant="filled"
                    helperText={
                      levelError
                        ? "Level needs to be between 0 and " +
                          settings.MAX_LEVEL.toString()
                        : "Perfect!"
                    }
                    required
                  />
                </div>
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
                        levelError || radiusError || nameError || degreeError
                      }
                      onClick={saveSeedContainer}
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
                        levelError ||
                        radiusError ||
                        degreeError ||
                        nameError ||
                        !currentSeedContainer.id
                      }
                      onClick={updateSeedContainer}
                    >
                      <strong>Update</strong>
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      size="large"
                      type="Delete"
                      variant="contained"
                      disabled={!currentSeedContainer.id}
                      onClick={deleteSeedContainer}
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
export default SeedContainer;
