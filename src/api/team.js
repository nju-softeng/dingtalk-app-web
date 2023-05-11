import axios from "@/utils/request";

const api = {
  getPersonalTeams: "/v2/team",
  getOthersTeams: (userId) => "/v2/team/" + userId,
  updateUserTeamList: "/v2/userTeam/batch",
};

export function getPersonalTeams() {
  return axios({
    url: api.getPersonalTeams,
    method: "get",
  });
}

export function getOthersTeams(userId) {
  return axios({
    url: api.getOthersTeams(userId),
    method: "get",
  });
}

export function updateUserTeamList(userTeamList) {
  return axios({
    url: api.updateUserTeamList,
    method: "post",
    data: userTeamList,
  });
}
