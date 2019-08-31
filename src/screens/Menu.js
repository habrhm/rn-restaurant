import React, { Component } from 'react';
import { View, Text, ActivityIndicatorComponent, Modal, TouchableHighlight, Alert } from 'react-native';
import { Container, Tabs, Tab, Header, Left, Body, Drawer } from 'native-base';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';

import * as categoryActions from './../redux/actions/category';
import * as menuActions from './../redux/actions/menus';
import * as orderActions from './../redux/actions/orders';

import List from '../components/List'
import OrderedList from '../components/OrderedList'

import { categories, menus } from '../../data';
import AsyncStorage from '@react-native-community/async-storage';
import { FlatList } from 'react-native-gesture-handler';
import Axios from 'axios';
class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: categories,
            menus: menus,
            time: 360,
            timer: null,
            modalVisible: false,
            transactionData: {
                subTotal: 0,
                discount: 0,
                serviceCharge: 0,
                tax: 0,
                total: 0
            },

        };
    }
    async componentDidMount() {
        let timer = setInterval(() => (
            this.setState(state => (
                { time: state.time - 1 }
            ))
        ), 1000);
        await this.props.getCategoryData()
        await this.props.getMenuData()
        await this.props.getOrderData()
        const transaction = await AsyncStorage.getItem('transaction')
        await this.setState({
            transactionData: {
                ...this.state.transactionData,
                ...JSON.parse(transaction),
            },
            timer
        })

    }

    async setModalVisible(visible) {
        this.setState({ modalVisible: visible });
        let total = 0
        this.props.orders.data.forEach((value, index) => {
            if (value.status === 1) {
                total = total + value.price
            }
        })
        await this.setState({
            transactionData: {
                ...this.state.transactionData,
                subTotal: total,
                discount: total * 0,
                serviceCharge: total * 5 / 100,
                tax: total * 10 / 100,
                total: total * 0 + total + total * 5 / 100 + total * 10 / 100
            }
        })

    }

    async sendData() {
        let res
        this.props.orders.data.forEach(async (value) => {
            res = await Axios.post("http://192.168.1.110:3000/api/v1/order",
                {
                    menuId: value.menuId,
                    transactionId: value.transactionId,
                    qty: value.qty,
                    price: value.price,
                    status: value.status
                })
            if (!res) {
                alert('gagal Kirim')
            }
        })
        const {transactionData} = this.state
        res = await Axios.patch(`http://192.168.1.110:3000/api/v1/transaction/${transactionData.id}`,
            {
                tableNumber: transactionData.tableNumber,
                finishedTime: ((this.state.time - 360) * - 1).toString,
                subtotal: transactionData.subTotal,
                discount: transactionData.discount,
                serviceCharge: transactionData.serviceCharge,
                tax: transactionData.tax,
                total: transactionData.total,
                isPaid: false
            })
        if (!res) {
            alert('gagal Kirim')
        }
        this.props.navigation.navigate('OrderComplete', {id : transactionData.id})

    }


    handleConfirm() {
        const unOrdered = this.props.orders.data.filter((value) => (value.status == 0))
        Alert.alert(
            'Konfirmasi',
            'Apakan pesanan sudah selesai?',
            [
                {
                    text: 'OK', onPress: () => {
                        unOrdered.forEach(data => {
                            this.props.editOrders({
                                ...data,
                                status: 1
                            })
                        })
                    }
                },
                {
                    text: 'Cancel',
                    onPress: () => { },
                    style: 'cancel',
                },

            ],
            { cancelable: false },
        );
        console.log('====================================');
        console.log(unOrdered);
        console.log('====================================');

    }

    render() {
        let category = {
            data: this.state.categories
        }
        let menus = {
            data: this.state.menus
        }
        let isLoaded = !(this.props.menus.data.length == 0 && this.props.category.data.length == 0)
        if (isLoaded) {
            menus = this.props.menus
            category = this.props.category
        }
        const { orders } = this.props
        if (this.state.time === 0) {
            clearInterval(this.state.timer)
        }
        return (
            <Container>
                <Header hasTabs>
                    <Left><Text>{this.state.transactionData.tableNumber}</Text></Left>
                    <Body><Text>{this.state.time}</Text></Body>
                </Header>
                <Tabs>
                    {category.data.map((data) => (
                        <Tab heading={data.name} key={data.id}>
                            <List data={menus.data.filter((item) => (item.categoryId === data.id))} />
                        </Tab>
                    ))}
                </Tabs>

                <View style={{ flexDirection: 'row', alignContent: 'stretch' }} >
                    <Button disabled={orders.data.filter((value) => (value.status === 0)).length === 0} title='Konfirmasi'
                        onPress={() => {
                            this.handleConfirm();
                        }}
                    />
                    <Button disabled={orders.data.length === 0} title='Bayar'
                        onPress={() => {
                            this.sendData()
                        }}
                    />
                    <Button title='Lihat tagihan'
                        onPress={() => {
                            this.setModalVisible(!this.state.modalVisible);
                        }}
                    />
                </View>
                <View style={{ height: '40%' }}>
                    {orders.data.length !== 0 && (
                        <OrderedList />
                    )}
                </View>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setModalVisible(!this.state.modalVisible);
                    }}>
                    <View style={{ marginTop: 22 }}>
                        <View>

                            <View
                                style={{ height: '10%' }}
                            >

                                <Button title='Close'
                                    onPress={() => {
                                        this.setModalVisible(!this.state.modalVisible);
                                    }}
                                />
                            </View>
                            <FlatList
                                data={this.props.orders.data.filter((value) => (value.status == 1))}
                                extraData={this.props.orders}
                                style={{
                                    height: "65%"
                                }}
                                renderItem={({ item, index }) => (
                                    <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                                        <Text>{item.menu.name} : {item.qty}</Text>
                                        <Text>{item.price}</Text>
                                    </View>
                                )}
                            />

                            <View
                                style={{
                                    height: '25%'
                                }}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                                    <Text>Subtotal</Text>
                                    <Text>{this.state.transactionData.subTotal}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                                    <Text>Discount</Text>
                                    <Text>{this.state.transactionData.discount}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                                    <Text>Services Charge(5%)</Text>
                                    <Text>{this.state.transactionData.serviceCharge}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                                    <Text>Tax (10%)</Text>
                                    <Text>{this.state.transactionData.tax}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                                    <Text>Total</Text>
                                    <Text>{this.state.transactionData.total}</Text>
                                </View>
                                <Button title='Bayar'
                                    onPress={() => {
                                        this.sendData()
                                    }}
                                />
                            </View>


                        </View>
                    </View>
                </Modal>
            </Container>
        );
    }
}
const mapDispatchToProps = dispatch => {
    return {
        getCategoryData: () => dispatch(categoryActions.getData()),
        getMenuData: () => dispatch(menuActions.getData()),
        getOrderData: () => dispatch(orderActions.getOrders()),
        editOrders: (value) => dispatch(orderActions.editOrders(value)),
    }
}
const mapStateToProps = state => {
    return {
        category: state.category,

        menus: state.menus,
        orders: state.orders,

    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Menu);
