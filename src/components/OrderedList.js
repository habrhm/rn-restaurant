import React, { Component } from 'react'
import { View, Text, TouchableOpacity, FlatList, Image, Dimensions, StyleSheet } from 'react-native'
import { connect } from 'react-redux'

import * as orderActions from './../redux/actions/orders'

import * as menuActions from './../redux/actions/menus'
import AsyncStorage from '@react-native-community/async-storage'
import { convertToRupiah } from '../functions';
import { colors, styles as globalStyles } from '../styles';
import { Card, CardItem } from 'native-base';


class List extends Component {
    constructor(props) {
        super(props)
        this.state = {
            orders: []
        }
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

        await this.props.getOrders()
    }

    render() {
        return (
            <View>
                <FlatList
                    data={this.props.orders.data}
                    extraData={this.props.orders}
                    horizontal={true}
                    renderItem={({ item, }) => (
                        <TouchableOpacity
                            key={item.id}
                            onPress={
                                this.handleAddOrder(item)
                            }
                        >
                            <View>

                                <Card style={{ width: Dimensions.get('window').width / 3 }}>
                                    <CardItem cardBody>
                                        <Image
                                            resizeMode={"cover"}
                                            source={{ uri: item.menu.image }}
                                            style={{
                                                height: Dimensions.get('window').width / 3,
                                                width: null,
                                                flex: 1
                                            }} />
                                        <View
                                            style={[ {
                                                ...StyleSheet.absoluteFillObject,
                                                width: 20,
                                                height: 20,
                                                borderRadius : 20/2,
                                                top: 5,
                                                left : 5,
                                                textAlign: "right",
                                                backgroundColor: colors.primary.light,
                                                justifyContent: 'center',
                                                alignItems: 'center',

                                            }]}
                                        >
                                            <Text
                                                style={[globalStyles.textLight]}
                                            >{item.qty}</Text></View>
                                    </CardItem>

                                    <Text style={globalStyles.textDark}>{item.menu.name}</Text>
                                    <Text style={globalStyles.textDark}>{convertToRupiah(item.price)}</Text>

                                </Card>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        )
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