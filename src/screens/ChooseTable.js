import React, { Component } from 'react'
import { View, Alert, StyleSheet } from 'react-native'
import { Text, Input, Button } from 'react-native-elements'

import { colors, styles as globalStyles } from '../styles'
import Axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      table: '',
      isLoading: false,
    }
  }
  handlePress = async () => {
    await this.setState({
      isLoading: true
    })
    try {
      const res = await Axios.post("http://192.168.1.48:3000/api/v1/transaction", {
        tableNumber: parseInt(this.state.table),
        isPaid: false
      })
      if (res) {
        await AsyncStorage.setItem('transaction', JSON.stringify(res.data.transaction))
        this.props.navigation.navigate('Menu')
      } else {
        alert('Koneksi gagal')
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Koneksi Gagal',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
      )
    }
    await this.setState({
      isLoading: false
    })


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

        <Text
          style={[globalStyles.textLight, {
            fontSize: 60,
            paddingBottom: 20,
            textAlign : 'center'
          }]}
        > Masukan Nomor Meja </Text>
        <Input
          value={this.state.username}
          placeholder='No Meja'
          keyboardType={'number-pad'}
          inputContainerStyle={{ borderWidth: 1, borderRadius: 30, borderColor: colors.text.white, }}
          placeholderTextColor={'#f5f5f5'}
          inputStyle={[globalStyles.textLight, {textAlign : 'center'}]}
          containerStyle={{ marginBottom: 20 }}
          onChangeText={(text) => this.handleChange(text, 'table')}
        />
        <Button
          title={'Submit'}
          loading={this.state.isLoading}
          loadingStyle={{color : 'white'}}
          disabled={this.state.isLoading}
          disabledStyle={{
            backgroundColor: colors.primary.light
          }}
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
  
})