import React, {Component} from 'react';
import { createStackNavigator, createBottomTabNavigator, createAppContainer  } from "react-navigation";
//import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import * as Screens from "./app/screens";


export default class App extends React.Component {

  render() {
    return <AppContainer />;
  }
}

const AppNavigator = createStackNavigator({
  Home: { screen: Screens.HomeScreen },
  NewData: { screen: Screens.NewDataScreen },
  Search: { screen: Screens.SearchScreen },
  Expense: { screen: Screens.NewDataScreen },
  Statistics: { screen: Screens.StatisticsScreen },
  Dene: {
    screen: Screens.dene, navigationOptions: {
      title: "Gelir Ekle", headerStyle: {
        backgroundColor: 'red'
      },}}
});

const TabNavigator = createBottomTabNavigator({
  Home: { screen: Screens.HomeScreen },
  Revenue: { screen: Screens.NewDataScreen },
  Expense: { screen: Screens.NewDataScreen },
  Statistics: { screen: Screens.StatisticsScreen }
});

/*const TabMaterial = createMaterialBottomTabNavigator({
  Home: { screen: Screens.HomeScreen },
  Revenue: { screen: Screens.NewDataScreen },
  Search: { screen: Screens.SearchScreen },
  Expense: { screen: Screens.NewDataScreen },
  Statistics: { screen: Screens.StatisticsScreen },
}, {
    initialRouteName: 'Home',
    activeColor: '#f0edf6',
    inactiveColor: '#3e2465',
    barStyle: { backgroundColor: '#694fad' },
  });*/

const AppContainer = createAppContainer(AppNavigator);