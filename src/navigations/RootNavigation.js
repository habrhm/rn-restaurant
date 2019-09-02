import { createAppContainer, createSwitchNavigator } from 'react-navigation'

import ChooseTable from '../screens/ChooseTable'
import OrderComplete from '../screens/OrderComplete'
import Menu from '../screens/Menu'
const switchNav = createSwitchNavigator(
    {
        ChooseTable : {
            screen: ChooseTable
        },
        Menu : {
            screen : Menu
        },
        OrderComplete : {
            screen : OrderComplete
        },
    },
    {
        
    }
)
const RootNavigation = createAppContainer(switchNav)

export default RootNavigation
