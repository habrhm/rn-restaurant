import axios from 'axios';
//import * as types from './../types';

export const getData = () => ({
  type: "GET_MENUS",
  payload: axios({
    method: 'GET',
    url: "http://192.168.1.110:3000/api/v1/menus"
  })
})