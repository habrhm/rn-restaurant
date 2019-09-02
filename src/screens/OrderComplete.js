import React, { Component } from 'react'
import { View,  TouchableNativeFeedback, StyleSheet } from 'react-native'
import {Text, Input, Button} from 'react-native-elements'

import {colors} from '../styles'
import Axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      code : '',
    }
  }
  handlePress = async () => {

    if(this.state.code === 'ahsiap'){
        await Axios.patch(`http://192.168.1.48:3000/api/v1/transaction/${this.props.navigation.getParam('id')}`, {isPaid : true}).then().catch(err => alert(err))
        await AsyncStorage.removeItem('transaction')
        this.props.navigation.navigate('ChooseTable')
        
    }else{
        alert('Kode Salah')
    }       
    
   

     
  }
  handleChange = (text, state) => {
    this.setState({
      [state] : text
    })
  }

  render() {
    return (
      <View
        style={styles.wrapper}
      >
        
        <Text
          style={[styles.text,{
            fontSize : 60,
            paddingBottom: 20,
          }]}
        > Order Complete</Text>
        <Text
          style={[styles.text,{
            fontSize : 60,
            paddingBottom: 20,
          }]}
        > #{this.props.navigation.getParam('id')} </Text>
        <Input 
          value={this.state.username}
          placeholder='Verification Code'
          leftIcon={{ type: 'ionicon', name: 'md-person', color:'#fff' }}
          inputContainerStyle={{borderWidth : 1, borderRadius : 30, borderColor : 'white',}}
          placeholderTextColor={'#cfcfcf'}
          inputStyle={styles.text}
          secureTextEntry={true}
          containerStyle={{marginBottom : 20}}
          onChangeText={(text) => this.handleChange(text, 'code')}
        />
        <Button 
          title={'Submit'}
          containerStyle={{alignSelf : 'stretch', marginBottom : 20 }}
          titleStyle={styles.text}
          buttonStyle={{backgroundColor: colors.primary.normal, borderRadius : 20}}
          onPress={this.handlePress}
        />
      

      </View>
    )
  }
}


const styles = StyleSheet.create({
  wrapper : {
    backgroundColor: colors.primary.light,
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center',
    paddingHorizontal : 20
    
  },
  text : {
    fontFamily: 'Montserrat-Regular',
    fontWeight : 'normal',
    color : colors.text.white,
  }
})