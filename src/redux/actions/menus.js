import axios from 'axios';
//import * as types from './../types';

export const getData = () => ({
  type: "GET_MENUS",
  payload: axios({
    method: 'GET',
    url: "http://192.168.42.100:3000/api/v1/menus"
  })
})