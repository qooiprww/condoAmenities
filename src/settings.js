const settings = {
  TASK_STATUS_QUEUED: "QED",
  TASK_STATUS_EXECUTING: "EXE",
  TASK_STATUS_FINISHED: "FIN",
  TASK_STATUS_FAILED: "FAL",
  MAX_LEVEL: 1,
  WATERING_TASK_THRESHOLD: 10,
  MAX_RADIUS: 32.0,
  TASK_WATERING: "WT",
  TASK_SEEDING: "SD",
  TASK_PLANT_DATA_GATHERING: "PD",
  TASK_AMBIENT_DATA_GATHERING: "AD",
  TASK_MANUAL_CONTROL: "MC",
  TASK_LIGHTING_CONTROL: "LC",
};
export default settings;

export const TASK_CHOICES = {
  [settings.TASK_WATERING]: "Watering Task",
  [settings.TASK_SEEDING]: "Seeding Task",
  [settings.TASK_PLANT_DATA_GATHERING]: "Plant Data Gathering Task",
  [settings.TASK_AMBIENT_DATA_GATHERING]: "Ambient Data Gathering Task",
  [settings.TASK_MANUAL_CONTROL]: "Manual Control Task",
  [settings.TASK_LIGHTING_CONTROL]: "Lighting Control Task",
};
