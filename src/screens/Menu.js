import React, { Component } from 'react'
import { View, Text, Alert, StyleSheet, FlatList, Dimensions } from 'react-native'
import { Container, Tabs, Tab, Header, Left, Body, ScrollableTab, Right } from 'native-base'
import Modal from 'react-native-modal';
import { Button, Divider } from 'react-native-elements'
import { connect } from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'

import * as categoryActions from './../redux/actions/category'
import * as menuActions from './../redux/actions/menus'
import * as orderActions from './../redux/actions/orders'

import List from '../components/List'
import OrderedList from '../components/OrderedList'

import { categories, menus } from '../../data'
import { colors, styles as globalStyles } from '../styles'
import { convertToRupiah, toMinute } from '../functions';

import Axios from 'axios'
class Menu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            orderedData: [],
            categories: categories,
            menus: menus,
            time: 0,
            timer: null,
            modalVisible: false,
            transactionData: {
                subTotal: 0,
                discount: 0,
                serviceCharge: 0,
                tax: 0,
                total: 0
            },

        }
    }
    async componentDidMount() {
        let timer = setInterval(() => (
            this.setState(state => (
                { time: state.time + 1 }
            ))
        ), 1000)
        let interval = setInterval(async () => {
            await Axios.patch(`http://192.168.1.48:3000/api/v1/transaction/orders/${this.state.transactionData.id}`, {})
            const orderData = await Axios.get(`http://192.168.1.48:3000/api/v1/transaction/orders/${this.state.transactionData.id}`)
            let orderDataWithMenu = []
            if (!orderData) {
                //error
            } else {
                orderData.data.forEach((value) => {
                    orderDataWithMenu = [...orderDataWithMenu,
                    {
                        ...value,
                        menu: this.props.menus.data.filter((item) => (item.id === value.menuId))[0]
                    }
                    ]
                })
            }

            await this.setState({
                //modalVisible: visible,
                orderedData: orderDataWithMenu
            })
        }, 60000)
        await this.props.getCategoryData()
        await this.props.getMenuData()
        await this.props.getOrderData()
        const transaction = await AsyncStorage.getItem('transaction')
        console.log('====================================');
        console.log(transaction);
        console.log('====================================');
        await this.setState({
            transactionData: {
                ...this.state.transactionData,
                ...JSON.parse(transaction),
            },
            timer
        })

    }

    async setModalVisible(visible) {
        await this.setState({
            modalVisible: visible,

        })



    }

    sendOrders() {
        this.props.orders.data.forEach(async (value) => {
            res = await Axios.post("http://192.168.1.48:3000/api/v1/order",
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
            const orderData = await Axios.get(`http://192.168.1.48:3000/api/v1/transaction/orders/${this.state.transactionData.id}`)
            let orderDataWithMenu = []
            if (!orderData) {
                //error
            } else {
                orderData.data.forEach((value) => {
                    orderDataWithMenu = [...orderDataWithMenu,
                    {
                        ...value,
                        menu: this.props.menus.data.filter((item) => (item.id === value.menuId))[0]
                    }
                    ]
                })
            }

            await this.setState({
                orderedData: orderDataWithMenu
            })

            let total = 0
            this.state.orderedData.forEach((value, index) => {

                total = total + value.price

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
            this.props.moveOrdersToSent()
        })

    }

    async payOrders() {
        let res
        const { transactionData } = this.state
        if (this.state.orderedData.filter(value => value.status === 0).length === 0) {
            res = await Axios.patch(`http://192.168.1.48:3000/api/v1/transaction/${transactionData.id}`,
                {
                    tableNumber: transactionData.tableNumber,
                    finishedTime: (this.state.time).toString,
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
            this.props.navigation.navigate('OrderComplete', { id: transactionData.id })
        } else {
            alert('Status belum KIRIM semua')
        }

    }


    handleConfirm() {

        Alert.alert(
            'Konfirmasi',
            'Apakan pesanan sudah selesai?',
            [
                {
                    text: 'OK', onPress: () => {
                        this.sendOrders()
                    }
                },
                {
                    text: 'Cancel',
                    onPress: () => { },
                    style: 'cancel',
                },

            ],
            { cancelable: false },
        )
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

        return (
            <Container>
                <Header
                    style={{
                        backgroundColor: colors.primary.normal
                    }}
                    androidStatusBarColor={colors.primary.normal}
                >
                    <Left
                        
                    >
                        <Text
                        style={[globalStyles.textLight, {
                            fontSize : 20,
                            textAlign : 'center',
                            borderWidth: 0.5 ,
                            borderColor : 'white',
                            
                            borderRadius : 25/2,
                            width : 25,
                            height : 25,
                        }]}
                        >
                    {this.state.transactionData.tableNumber}</Text>
                    </Left>
                    <Body>
                        
                    </Body>
                    <Right>
                        <Text
                            style={[globalStyles.textLight, {fontSize : 20}]}
                        >{(toMinute(this.state.time))}</Text>
                    </Right>
                </Header>
                {!this.props.menus.isLoading && (
                    <Tabs
                        renderTabBar={() => <ScrollableTab />}
                    >
                        {category.data.map((data) => (
                            <Tab
                                heading={data.name}
                                key={data.id}
                                tabStyle={{ backgroundColor: colors.primary.normal }}
                                activeTabStyle={{ backgroundColor: colors.primary.normal }}
                                activeTextStyle={globalStyles.textLight}
                                textStyle={globalStyles.textLight}
                            >
                                <List data={menus.data.filter((item) => (item.categoryId === data.id))} />
                            </Tab>
                        ))}
                    </Tabs>
                )}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly'
                    }}
                >
                    <Button
                        disabled={orders.data.filter((value) => (value.status === 0)).length === 0}
                        title={'Konfirmasi'}
                        containerStyle={{
                            alignSelf: 'stretch',
                            marginBottom: 20
                        }}
                        titleStyle={globalStyles.textLight}
                        buttonStyle={{
                            backgroundColor: colors.primary.light,
                            borderRadius: 20,
                            height: 40,
                        }}
                        onPress={() => {
                            this.handleConfirm()
                        }}
                    />
                    <Button
                        disabled={this.state.orderedData.length === 0} 
                        title='Bayar'
                        containerStyle={{
                            alignSelf: 'stretch',
                            marginBottom: 20
                        }}
                        titleStyle={globalStyles.textLight}
                        buttonStyle={{
                            backgroundColor: colors.primary.light,
                            borderRadius: 20,
                            height: 40,
                        }}
                        onPress={() => {
                            this.payOrders()
                        }}
                    />
                    <Button
                        title='Lihat tagihan'
                        containerStyle={{
                            alignSelf: 'stretch',
                            marginBottom: 20
                        }}
                        titleStyle={globalStyles.textLight}
                        buttonStyle={{
                            backgroundColor: colors.primary.light,
                            borderRadius: 20,
                            height: 40,
                        }}
                        onPress={() => {
                            this.setModalVisible(!this.state.modalVisible)
                        }}
                    />
                </View>
                <View style={{minHeight : 120}}>
                    {orders.data.length !== 0 && (
                        <OrderedList />
                    )}
                </View>
                <Modal
                    
                    isVisible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setModalVisible(!this.state.modalVisible)
                    }}
                    
                    >
                    <View style={{
                        height: Dimensions.get("screen").height * 80/100,
                        backgroundColor: 'white',
                        borderWidth : 0.5
                    }}>

                        <View
                            style={{
                                flexDirection: 'row-reverse',
                                marginBottom: 5,
                                padding: 10,
                                borderBottomWidth: 0.5,
                                backgroundColor : colors.primary.normal
                            }}
                        >
                            <Button
                                icon={{
                                    type: 'ionicon',
                                    name: "md-close",
                                    size: 20,
                                    color: "white"
                                }}
                                buttonStyle={{
                                    padding: 1,
                                    paddingVertical: 2,
                                    backgroundColor: 'red',
                                    borderRadius: 50
                                }}
                                onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible)
                                }}
                            />
                        </View>
                        <View
                            style={{
                                flexGrow: 1,
                                justifyContent: 'space-between',
                                padding: 10

                            }}
                        >
                            <View>
                                <FlatList
                                    data={this.state.orderedData}
                                    extraData={this.state}
                                    renderItem={({ item, index }) => (
                                        <View style={{ flexDirection: 'row', justifyContent: "space-evenly" }}>
                                            <Text style={[globalStyles.textDark, {
                                                marginRight: 5,
                                                width: 70,
                                                color: item.status === 0 ? 'red' : 'green',
                                                fontSize: 16 
                                            }]}>{item.status === 0 ? 'TUNGGU' : 'KIRIM'}</Text>
                                            <Text style={[globalStyles.textDark, { flexGrow: 1 },{ fontSize: 16 } ]}>{item.menu.name} : {item.qty}</Text>
                                            <Text style={[globalStyles.textDark,{ fontSize: 16 }]}>{convertToRupiah(item.price)}</Text>
                                        </View>
                                    )}
                                />
                            </View>

                            <View
                            >
                                <Divider 
                                style={{
                                    marginVertical : 5,
                                    borderBottomWidth : 2
                                }}
                                />
                                <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                                    <Text style={[globalStyles.textDark, { fontSize: 16 }]}>Subtotal</Text>
                                    <Text style={[globalStyles.textDark, { fontSize: 16 }]}>{convertToRupiah(this.state.transactionData.subTotal)}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                                    <Text style={[globalStyles.textDark, { fontSize: 16 }]}>Discount</Text>
                                    <Text style={[globalStyles.textDark, { fontSize: 16 }]}>{convertToRupiah(this.state.transactionData.discount)}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                                    <Text style={[globalStyles.textDark, { fontSize: 16 }]}>Services Charge(5%)</Text>
                                    <Text style={[globalStyles.textDark, { fontSize: 16 }]}>{convertToRupiah(this.state.transactionData.serviceCharge)}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                                    <Text style={[globalStyles.textDark, { fontSize: 16 }]}>Tax (10%)</Text>
                                    <Text style={[globalStyles.textDark, { fontSize: 16 }]}>{convertToRupiah(this.state.transactionData.tax)}</Text>
                                </View>
                                <Divider 
                                style={{
                                    marginVertical : 5,
                                    borderBottomWidth : 1
                                }}
                                />
                                <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                                    <Text style={[globalStyles.textDark, { fontSize: 16 }]}>Total</Text>
                                    <Text style={[globalStyles.textDark, { fontSize: 16 }]}>{convertToRupiah(this.state.transactionData.total)}</Text>
                                </View>
                                <Divider 
                                style={{
                                    marginVertical : 5,
                                    borderBottomWidth : 2
                                }}
                                />
                                <Button title='Bayar'
                                    containerStyle={{
                                        alignSelf: 'stretch',
                                    }}
                                    titleStyle={globalStyles.textLight}
                                    buttonStyle={{
                                        backgroundColor: colors.primary.light,
                                        borderRadius: 20,
                                        height: 40,
                                    }}
                                    onPress={() => {
                                        this.payOrders()
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
            </Container>
        )
    }
}
const mapDispatchToProps = dispatch => {
    return {
        getCategoryData: () => dispatch(categoryActions.getData()),
        getMenuData: () => dispatch(menuActions.getData()),
        getOrderData: () => dispatch(orderActions.getOrders()),
        moveOrdersToSent: () => dispatch(orderActions.moveOrdersToSent()),
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
)(Menu)

const styles = StyleSheet.create({

})