import http from "../http-common";

class PlantTypeDataService {
  getAll() {
    return http.get("/farm/plant_type");
  }

  get(id) {
    return http.get(`/farm/plant_type/${id}`);
  }

  create(data) {
    return http.post("/farm/plant_type", data);
  }

  update(id, data) {
    return http.put(`/farm/plant_type/${id}`, data);
  }

  delete(id) {
    return http.delete(`/farm/plant_type/${id}`);
  }

  deleteAll() {
    return http.delete(`/farm/plant_type`);
  }
}

export default new PlantTypeDataService();
