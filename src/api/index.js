import axios from "@/utils/request";

export function readJson() {
  return axios({
    url: '/readJson',
    method: 'get'
  })
}
export function writeJson(data) {
  return axios({
    url: '/writeJson',
    method: 'post',
    data
  })
}
