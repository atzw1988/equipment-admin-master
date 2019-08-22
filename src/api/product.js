import axios from '@/libs/api.request'
export const getProductList = (params) => {
  return axios.request({
    url: '/manage/product/findPage',
    params,
    method: 'get'
  })
}

export const deleteProduct = (id) => {
  return axios.request({
    url: '/manage/product/del/' + id,
    method: 'delete'
  })
}

export const addProduct = (data) => {
  return axios.request({
    url: '/manage/product/save',
    data,
    method: 'post'
  })
}

export const updateProduct = (data) => {
  return axios.request({
    url: '/manage/product/update',
    data,
    method: 'post'
  })
}
