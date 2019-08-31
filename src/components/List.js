import React, { Component } from 'react';
import { View, Text, TouchableNativeFeedback, FlatList, Image } from 'react-native';
import { connect } from 'react-redux';

import * as orderActions from './../redux/actions/orders';
import AsyncStorage from '@react-native-community/async-storage';




 class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    handleAddOrder = item => async () => {
        const transaction = await AsyncStorage.getItem('transaction')
        const order = this.props.orders.data.filter((data) => (data.menuId === item.id))
        const orderToSend = {
            menuId : item.id,
            transactionId :JSON.parse(transaction).id,
            qty : 1,
            price : item.price,
            status : 0,
            menu : item
        }
        if(order.length == 0){
        this.props.addOrders(orderToSend)
        }else{
            this.props.editOrders({
                ...orderToSend,
                price : order[0].price + item.price,
                qty : order[0].qty + 1
            })
        }
    }
    async componentDidMount (){
       
        await this.props.getOrderData()
    }
    // menuId: DataTypes.INTEGER,
    // transactionId: DataTypes.INTEGER,
    // qty: DataTypes.INTEGER,
    // price: DataTypes.DOUBLE,
    // status: DataTypes.INTEGER
    render() {
        const {data, orders} = this.props
        
        return (
            <View>
                <FlatList
                    data={data}
                    renderItem={({ item, index }) => (
                        <TouchableNativeFeedback 
                            key={index}
                           onPress={
                               this.handleAddOrder(item)
                            }
                        >   
                            <View>
                                <Image style={{width :100, height: 100}} source={{uri : 'https://previews.123rf.com/images/eljanstock/eljanstock1811/eljanstock181113887/112482119-food-vector-icon-isolated-on-transparent-background-food-transparency-logo-concept.jpg'}} />
                                <Text>{item.name}</Text>
                                <Text>{item.price}</Text>
                            </View>
                        </TouchableNativeFeedback>
                    )}
                />
            </View>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addOrders: (value) => dispatch(orderActions.addOrders(value)),
        editOrders: (value) => dispatch(orderActions.editOrders(value)),
        getOrderData : () => dispatch(orderActions.getOrders()),
    }
  }
  const mapStateToProps = state => {
    return {
      orders: state.orders,
    }
  }
export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(List)