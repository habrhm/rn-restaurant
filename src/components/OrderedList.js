import React, { Component } from 'react';
import { View, Text, TouchableNativeFeedback, FlatList, Image } from 'react-native';
import { connect } from 'react-redux';

import * as orderActions from './../redux/actions/orders';

import * as menuActions from './../redux/actions/menus';
import AsyncStorage from '@react-native-community/async-storage';




class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: []
        };
    }
    handleAddOrder = item => () => {
        if (item.qty > 1) {
            this.props.editOrders({
                ...item,
                qty: item.qty - 1
            })
        } else {
            this.props.removeOrders(item.menuId)
        }
    }
    async componentDidMount() {
        await this.props.getMenuData()
        await this.props.getOrders()


    }

    render() {


        return (

            <View>
                <FlatList
                    data={this.props.orders.data}
                    extraData={this.props.orders}
                    horizontal={true}
                    renderItem={({ item, index }) => (
                        <TouchableNativeFeedback
                            key={index}
                            onPress={
                                this.handleAddOrder(item)
                            }
                        >
                            <View>
                                <Image style={{ width: 100, height: 100 }} source={{ uri: 'https://previews.123rf.com/images/eljanstock/eljanstock1811/eljanstock181113887/112482119-food-vector-icon-isolated-on-transparent-background-food-transparency-logo-concept.jpg' }} />
                                <Text>{item.menu.name}</Text>
                                <Text>{item.qty}</Text>
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
        getOrders: () => dispatch(orderActions.getOrders()),
        editOrders: (value) => dispatch(orderActions.editOrders(value)),
        removeOrders: (value) => dispatch(orderActions.removeOrders(value)),
    }
}
const mapStateToProps = state => {
    return {
        orders: state.orders,
        menus: state.menus
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(List)