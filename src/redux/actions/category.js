import axios from 'axios'
//import * as types from './../types'

export const getData = () => ({
  type: "GET_CATEGORIES",
  payload: axios({
    method: 'GET',
    url: "http://192.168.1.48:3000/api/v1/categories"
  })
})

// export const addTodos = value => ({
//   type: types.ADD_TODO,
//   payload: value
// })

// export const editTodos = value => ({
//   type: types.EDIT_TODOS,
//   payload: value
// })

// export const removeTodos = id => ({
//   type: types.REMOVE_TODOS,
//   payload: id
// })