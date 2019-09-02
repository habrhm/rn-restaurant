

export const getOrders = () => ({
  type: "GET_ORDERS"
})
export const moveOrdersToSent = () => ({
  type: "MOVE_TO_SENT_ORDERS"
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