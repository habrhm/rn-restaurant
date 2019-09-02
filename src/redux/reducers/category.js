//import * as types from './../types'

const initialState = {
  isLoading: false,
  
  data: [],
  
  error: null
}

export default function category(state = initialState, action) {
  switch (action.type) {
    case "GET_CATEGORIES_PENDING":
      return {
        ...state,
        isLoading: true
      }
    case "GET_CATEGORIES_FULFILLED":
      return {
        ...state,
        isLoading: false,
        data: action.payload.data
      }
    case "GET_CATEGORIES_REJECTED":
      return {
        ...state,
        isLoading: false,
        error: payload.message
      }
    // case types.ADD_TODO:
    //   return {
    //     ...state,
    //     data: state.data.concat(action.payload)
    //   }
    // case types.EDIT_TODOS:
    //   const newTodo = state.data.map(item => {
    //     if (item.id === action.payload.id) {
    //       return action.payload
    //     }

    //     return item
    //   })
    //   return {
    //     ...state,
    //     data: newTodo
    //   }
    // case types.REMOVE_TODOS:
    //   const removeTodo = state.data.filter(item => item.id !== action.payload)
    //   return {
    //     ...state,
    //     data: removeTodo
    //   }
    default:
      return state
  }
}