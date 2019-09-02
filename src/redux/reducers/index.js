import { combineReducers } from 'redux'
import category from './category'
import menus from './menus'
import orders from './orders'

const appReducer = combineReducers({
  category,
  menus,
  orders,
})

export default appReducer

