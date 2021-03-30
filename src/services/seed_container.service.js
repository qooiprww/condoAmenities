import http from "../http-common";

class SeedContainerDataService {
  getAll() {
    return http.get("/farm/seed_container");
  }

  get(id) {
    return http.get(`/farm/seed_container/${id}`);
  }

  create(data) {
    return http.post("/farm/seed_container", data);
  }

  update(id, data) {
    return http.put(`/farm/seed_container/${id}`, data);
  }

  delete(id) {
    return http.delete(`/farm/seed_container/${id}`);
  }

  deleteAll() {
    return http.delete(`/farm/seed_container`);
  }

  findByName(data) {
    return http.post(`/farm/seed_container/name`, data);
  }
}

export default new SeedContainerDataService();
