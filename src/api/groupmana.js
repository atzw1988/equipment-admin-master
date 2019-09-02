import axios from '@/libs/api.request'
export const getGroupList = (params) => {
  return axios.request({
    url: '/manage/group/findPage',
    params,
    method: 'get'
  })
}

export const deleteGroup = (id) => {
  return axios.request({
    url: '/manage/group/del/' + id,
    method: 'delete'
  })
}

export const addGroup = (data) => {
  return axios.request({
    url: '/manage/group/save',
    data,
    method: 'post'
  })
}

export const updateGroup = (data) => {
  return axios.request({
    url: '/manage/group/update',
    data,
    method: 'post'
  })
}

export const getGroupEqList = (params) => {
  return axios.request({
    url: '/manage/group/getGroupDevice',
    params,
    method: 'get'
  })
}

export const getUngroupEqList = (params) => {
  return axios.request({
    url: '/manage/group/getUnGrouped',
    params,
    method: 'get'
  })
}

export const addGroupEq = (data) => {
  return axios.request({
    url: '/manage/group/addGroupDevice',
    data,
    method: 'post'
  })
}

export const deleteGroupEq = (gid, id) => {
  return axios.request({
    url: '/manage/group/del/dev/' + gid + '/' + id,
    method: 'delete'
  })
}
