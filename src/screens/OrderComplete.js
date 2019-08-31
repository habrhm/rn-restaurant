import React, { Component } from 'react';
import { View,  TouchableNativeFeedback, StyleSheet } from 'react-native';
import {Text, Input, Button} from 'react-native-elements';

import {colors} from '../styles';
import Axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      table : '',
    };
  }
  handlePress = async () => {

          
      await AsyncStorage.setItem('table',this.state.table)
      this.props.navigation.navigate('Menu',{table : this.state.table})
   

     
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
        {/* <Input 
          value={this.state.username}
          placeholder='No Meja'
          leftIcon={{ type: 'ionicon', name: 'md-person', color:'#fff' }}
          inputContainerStyle={{borderWidth : 1, borderRadius : 30, borderColor : 'white',}}
          placeholderTextColor={'#cfcfcf'}
          inputStyle={styles.text}
          containerStyle={{marginBottom : 20}}
          onChangeText={(text) => this.handleChange(text, 'table')}
        />
       
        <Button 
          title={'Submit'}
          containerStyle={{alignSelf : 'stretch', marginBottom : 20 }}
          titleStyle={styles.text}
          buttonStyle={{backgroundColor: colors.primary.normal, borderRadius : 20}}
          onPress={this.handlePress}
        /> */}

      </View>
    );
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