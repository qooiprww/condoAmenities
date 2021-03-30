import http from "../http-common";

class TaskDataService {
  getTotalTaskNumber() {
    return http.get("/taskEngine/all");
  }

  getCurrentTask(id) {
    return http.get(`/taskEngine/current`);
  }

  getNextTask(data) {
    return http.get("/taskEngine/next");
  }

  create(data) {
    return http.post("/farm/task", data);
  }

  update(id, data) {
    return http.put(`/farm/task/${id}`, data);
  }
}

export default new TaskDataService();
