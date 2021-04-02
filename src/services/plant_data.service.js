import http from "../http-common";

class PlantDataDataService {
  getAll() {
    return http.get("/farm/plant_data");
  }

  get(id) {
    return http.get(`/farm/plant_data/plant/${id}`);
  }

  getLatest(id) {
    return http.get(`/farm/plant_data/plant/${id}/latest`);
  }

  create(data) {
    return http.post("/farm/plant_data", data);
  }

  update(id, data) {
    return http.put(`/farm/plant_data/${id}`, data);
  }

  delete(id) {
    return http.delete(`/farm/plant_data/${id}`);
  }

  deleteAll() {
    return http.delete(`/farm/plant_data`);
  }
}

export default new PlantDataDataService();
