import React, { Component } from 'react'
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, Dimensions } from 'react-native'
import { connect } from 'react-redux'

import * as orderActions from './../redux/actions/orders'
import AsyncStorage from '@react-native-community/async-storage'
import { } from 'react-native-elements';
import { CardItem, Card } from 'native-base';
import { } from 'react-native-gesture-handler';

import { colors, styles as globalStyles } from '../styles'
import {convertToRupiah} from '../functions';



class List extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    handleAddOrder = item => async () => {
        const transaction = await AsyncStorage.getItem('transaction')
        const order = this.props.orders.data.filter((data) => (data.menuId === item.id))
        const orderToSend = {
            menuId: item.id,
            transactionId: JSON.parse(transaction).id,
            qty: 1,
            price: item.price,
            status: 0,
            menu: item
        }

        if (order.length == 0) {
            this.props.addOrders({
                ...orderToSend,
                id: this.props.orders.data.length + this.props.orders.sentData.length + 1
            })
        } else {
            this.props.editOrders({
                ...orderToSend,
                price: order[0].price + item.price,
                qty: order[0].qty + 1
            })
        }
    }
    async componentDidMount() {

        await this.props.getOrderData()
    }
    formatRow = (data, numColumns) => {
        const numberOfFullRows = Math.floor(data.length / numColumns);
        let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
        while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
            data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
            numberOfElementsLastRow++;
        }
        return data;
    }
    render() {
        const { data } = this.props

        return (
            <View>
                <FlatList
                    numColumns={2}
                    style={styles.container}
                    data={this.formatRow(data, 2)}
                    data={data}
                    //  contentContainerStyle={{justifyContent: 'space-around'}}
                    keyExtractor={(item => item.id)}
                    renderItem={({ item, index }) => {
                        if (item.empty === true) {
                            return <View style={[styles.item, styles.itemInvisible]} />;
                        }
                        return (
                            <TouchableOpacity style={[styles.item]}
                                onPress={
                                    this.handleAddOrder(item)
                                }
                            >
                                <Card >
                                    <CardItem cardBody>
                                        <Image
                                            resizeMode={"cover"}
                                            source={{ uri: item.image }} 
                                            style={{ 
                                                height: Dimensions.get('window').width / 2, 
                                                width: null, 
                                                flex: 1 }} />
                                    </CardItem>
                                    <View style={{
                                        paddingHorizontal : 5,
                                        paddingBottom: 5,
                                    }}>
                                    <Text style={globalStyles.textDark}>{item.name}</Text>
                                    <Text style={globalStyles.textDark}>{convertToRupiah(item.price)}</Text>
                                    </View>
                                </Card>
                            </TouchableOpacity>
                        );
                    }
                    }
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        //flex: 1,
        margin: 3,
    },
    item: {
        //   //backgroundColor: '#6495ED',
        //   alignItems: 'center',
        //   justifyContent: 'center',
        flex: 1,
        margin: 1,
    },
    itemInvisible: {
        backgroundColor: 'transparent',
    },
    itemText: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
});

const mapDispatchToProps = dispatch => {
    return {
        addOrders: (value) => dispatch(orderActions.addOrders(value)),
        editOrders: (value) => dispatch(orderActions.editOrders(value)),
        getOrderData: () => dispatch(orderActions.getOrders()),
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