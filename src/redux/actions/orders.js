

export const getOrders = () => ({
  type: "GET_ORDERS"
})
export const clearOrders = () => ({
  type: "CLEAR_ORDERS"
})

export const addOrders = value => ({
  type: 'ADD_ORDERS',
  payload: value
})

export const editOrders = value => ({
  type: 'EDIT_ORDERS',
  payload: value
})

export const removeOrders = id => ({
  type: 'REMOVE_ORDERS',
  payload: id
})