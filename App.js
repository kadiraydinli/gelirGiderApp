import React, {Component} from 'react';
import { createStackNavigator, createAppContainer  } from "react-navigation";
import * as Screens from "./app/screens";


export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

const AppNavigator = createStackNavigator({
  Home: { screen: Screens.HomeScreen },
  NewData: { screen: Screens.NewDataScreen },
  Statistics: { screen: Screens.StatisticsScreen },
  Settings: { screen: Screens.SettingsScreen },
  Dene: {
    screen: Screens.dene, navigationOptions: {
      title: "Gelir Ekle", headerStyle: {
        backgroundColor: 'red'
      },}}
});

const AppContainer = createAppContainer(AppNavigator);