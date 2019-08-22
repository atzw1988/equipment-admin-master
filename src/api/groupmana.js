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
