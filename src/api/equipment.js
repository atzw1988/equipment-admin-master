import axios from '@/libs/api.request'
export const getEquipmentList = (params) => {
  return axios.request({
    url: '/manage/device/findPage',
    params,
    method: 'get'
  })
}

export const addEquipment = (data) => {
  return axios.request({
    url: '/manage/device/add',
    data,
    method: 'post'
  })
}

export const deleteEquipment = (id) => {
  return axios.request({
    url: '/manage/device/del/' + id,
    method: 'delete'
  })
}

export const getEquipmentdetail = (id) => {
  const params = {
    deviceId: id
  }
  return axios.request({
    url: '/manage/device/findData',
    params,
    method: 'get'
  })
}

export const updataEquipment = (data) => {
  return axios.request({
    url: '/manage/device/update',
    data,
    method: 'post'
  })
}

export const getEquipmentCount = (params) => {
  return axios.request({
    url: '/manage/device/findCount',
    params,
    method: 'get'
  })
}

export const getAllProduct = () => {
  return axios.request({
    url: '/manage/product/findAllProduct',
    method: 'get'
  })
}
