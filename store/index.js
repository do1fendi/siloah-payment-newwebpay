export const state = () => ({
  userName: 'siloahapiweb',
  password: '4qe3aI1!XSZA)Q^mR*wIChEE',
  token: '',
  orderNumber: '',
})

export const mutations = {
  SET_TOKEN(state, payload) {
    state.token = payload
  },
  SET_ORDERNUMBER(state, payload) {
    state.orderNumber = payload
  },
}

export const getters = {
  GET_USERNAME: (state) => state.userName,
  GET_PASSWORD: (state) => state.password,
  GET_TOKEN: (state) => state.token,
  GET_ORDERNUMBER: (state) => state.orderNumber,
}
