import axios from '@/libs/api.request'

export const login = ({ userName, password }) => {
  const data = {
    loginName: userName,
    password: password
  }
  return axios.request({
    url: '/sys/user/login',
    data,
    method: 'post'
  })
}
// export const login = ({ userName, password }) => {
//   const data = {
//     userName,
//     password
//   }
//   return axios.request({
//     url: 'login',
//     data,
//     method: 'post'
//   })
// }

export const getUserInfo = () => {
  return axios.request({
    url: '/sys/user/currentUser',
    method: 'get'
  })
}
// export const getUserInfo = (token) => {
//   return axios.request({
//     url: 'get_info',
//     params: {
//       token
//     },
//     method: 'get'
//   })
// }

export const logout = (token) => {
  return axios.request({
    url: '/sys/user/logout',
    method: 'post'
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const getUserList = (params) => {
  return axios.request({
    url: '/sys/user/findPage',
    params,
    method: 'get'
  })
}

export const deleteUser = (ids) => {
  return axios.request({
    url: '/sys/user/del/' + ids,
    method: 'delete'
  })
}

export const addUser = (data) => {
  console.log(data)
  return axios.request({
    url: '/sys/user/addUser',
    data,
    method: 'post'
  })
}

export const updateUser = (params) => {
  const data = {
    login_name: params.login_name,
    user_name: params.user_name,
    user_phone: params.user_phone,
    org_id: params.org_id,
    role_id: params.role_id,
    user_state: params.user_state
  }
  return axios.request({
    url: '/sys/user/update',
    data,
    method: 'post'
  })
}

// 获取角色列表
export const getRoleList = () => {
  return axios.request({
    url: '/sys/role/findAllRole',
    method: 'get'
  })
}

export const getOrgList = () => {
  return axios.request({
    url: '/sys/org/findAllOrg',
    method: 'get'
  })
}

// 角色启用或者停用
export const lockUser = (data) => {
  return axios.request({
    url: '/sys/user/lock',
    data,
    method: 'post'
  })
}
