import {StyleSheet} from 'react-native';
const colors = {
    primary : {
        normal : '#ff5722' ,
        light : '#ff8a50',
        dark : '#c41c00',
    },
    secondary : {
        normal : '#d32f2f' ,
        light : '#ff6659',
        dark : '#9a0007',
    },
    text : {
        white : '#ffffff',
        black : '#000000'
    }
    
}
const styles = StyleSheet.create({
    textLight: {
        fontFamily: 'Montserrat-Regular',
        fontWeight: 'normal',
        color: colors.text.white,
    }, 
    textDark: {
        fontFamily: 'Montserrat-Regular',
        fontWeight: 'normal',
        color: colors.text.black,
    }
})

export {colors, styles}

