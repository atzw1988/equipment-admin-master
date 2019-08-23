import axios from '@/libs/api.request'
export const getOrganizationList = (params) => {
  return axios.request({
    url: '/sys/org/findPage',
    params,
    method: 'get'
  })
}

export const addOrganization = (data) => {
  return axios.request({
    url: '/sys/org/addOrg',
    data,
    method: 'post'
  })
}

export const deleteOrganization = (id) => {
  return axios.request({
    url: '/sys/org/del/' + id,
    method: 'delete'
  })
}

export const updateOrganization = (data) => {
  return axios.request({
    url: '/sys/org/updateOrg',
    data,
    method: 'post'
  })
}

export const getOrganizationDetail = (params) => {
  return axios.request({
    url: '/sys/org/findByOrgId',
    params,
    method: 'get'
  })
}
