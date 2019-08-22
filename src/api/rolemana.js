import axios from '@/libs/api.request'
export const getRoleList = (params) => {
  return axios.request({
    url: '/sys/role/findPage',
    params,
    method: 'get'
  })
}

export const deleteRole = (id) => {
  return axios.request({
    url: '/sys/role/deleteRole/' + id,
    method: 'delete'
  })
}

export const searchRole = (params) => {
  return axios.request({
    url: '/sys/role/findRoleById',
    params,
    method: 'get'
  })
}

export const roleDetail = (params) => {
  return axios.request({
    url: '/sys/role/findRoleById',
    params,
    method: 'get'
  })
}

export const addRole = (data) => {
  return axios.request({
    url: '/sys/role/saveRole',
    data,
    method: 'post'
  })
}

export const getModuleList = () => {
  return axios.request({
    url: '/sys/modules/findAllList',
    method: 'get'
  })
}
