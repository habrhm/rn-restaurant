import React, { Component } from 'react'
import { View, TouchableNativeFeedback,StatusBar, StyleSheet } from 'react-native'
import { Text, Input, Button } from 'react-native-elements'

import { colors, styles as globalStyles } from '../styles'
import Axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      code: '',
    }
  }
  handlePress = async () => {

    if (this.state.code === 'ahsiap') {
      await Axios.patch(`http://192.168.1.48:3000/api/v1/transaction/${this.props.navigation.getParam('id')}`, { isPaid: true }).then().catch(err => alert(err))
      await AsyncStorage.removeItem('transaction')
      this.props.navigation.navigate('ChooseTable')

    } else {
      alert('Kode Salah')
    }




  }
  handleChange = (text, state) => {
    this.setState({
      [state]: text
    })
  }

  render() {
    return (
      <View
        style={styles.wrapper}
      >
        <StatusBar backgroundColor={colors.primary.normal} barStyle="light-content" />
        <Text
          style={[styles.text, {
            fontSize: 30,
            paddingBottom: 20,
            textAlign: 'center'
          }]}
        > Pesanan Selesai</Text>
        <Text
          style={[styles.text, {
            fontSize: 20,
            paddingBottom: 20,
            textAlign: 'center'
          }]}
        >mohon menuju kasir untuk menyelesaikan pembayaran</Text>
        <Text
          style={[styles.text,
          {
            fontSize: 20,
            paddingBottom: 20,
          }]}
        >Kode transaksi : #{this.props.navigation.getParam('id')} </Text>
        <Input
          value={this.state.username}
          placeholder='Kode Konfirmasi'
          inputContainerStyle={{
            borderWidth: 1,
            borderRadius: 5,
            borderColor: 'white',
          }}
          placeholderTextColor={'#f5f5f5'}
          inputStyle={[styles.text, {margin : 0}]}
          secureTextEntry={true}
          inputStyle={[globalStyles.textLight, {textAlign : 'center'}]}
          containerStyle={{ margin:0,marginBottom : 20}}
          onChangeText={(text) => this.handleChange(text, 'code')}
        />
        <Button
          title={'Kembali ke Pilih Meja'}
          containerStyle={{ alignSelf: 'stretch', marginBottom: 20, marginHorizontal : 11 }}
          titleStyle={styles.text}
          buttonStyle={{ backgroundColor: colors.primary.light, borderRadius: 5,
            height: 40, }}
          onPress={this.handlePress}
        />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.primary.normal,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  text: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: 'normal',
    color: colors.text.white,
  }
})