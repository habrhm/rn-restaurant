

const initialState = {
  isLoading: false,
  data: [],
  error: null
}

export default function orders(state = initialState, action) {
  switch (action.type) {
    case "GET_ORDERS":
      return {
        ...state,
      }
    case "ADD_ORDERS":
      return {
        ...state,
        data: state.data.concat(action.payload)
      };
    case "EDIT_ORDERS":
      const newTodo = state.data.map(item => {
        if (item.menuId === action.payload.menuId) {
          return action.payload
        }
        return item
      })
      return {
        ...state,
        data: newTodo
      };
    case "REMOVE_ORDERS":
      const removeTodo = state.data.filter(item => item.menuId !== action.payload)
      return {
        ...state,
        data : removeTodo
      }
    default:
      return state
  }
}