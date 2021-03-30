import http from "../http-common";

class PlantDataService {
  getAll() {
    return http.get("/farm/plant");
  }

  get(id) {
    return http.get(`/farm/plant/${id}`);
  }

  create(data) {
    return http.post("/farm/plant", data);
  }

  update(id, data) {
    return http.put(`/farm/plant/${id}`, data);
  }

  delete(id) {
    return http.delete(`/farm/plant/${id}`);
  }

  deleteAll() {
    return http.delete(`/farm/plant`);
  }
}

export default new PlantDataService();
