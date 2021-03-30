import http from "../http-common";

class AmbientDataDataService {
  getAll() {
    return http.get("/farm/ambient_data");
  }

  get(id) {
    return http.get(`/farm/ambient_data/${id}`);
  }

  getLatest() {
    return http.get(`/farm/ambient_data/latest`);
  }

  create(data) {
    return http.post("/farm/ambient_data", data);
  }

  update(id, data) {
    return http.put(`/farm/ambient_data/${id}`, data);
  }

  delete(id) {
    return http.delete(`/farm/ambient_data/${id}`);
  }

  deleteAll() {
    return http.delete(`/farm/ambient_data`);
  }
}

export default new AmbientDataDataService();
