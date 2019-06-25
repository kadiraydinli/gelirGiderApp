import React, { Component } from 'react';
import { Platform, StyleSheet, Image, View, Button } from 'react-native';
import { Container, Header, Content, Text, Left, Icon, Body, Right, Title, Tabs, Tab, TabHeading } from 'native-base';
import { createMaterialTopTabNavigator, createAppContainer } from "react-navigation";

export class StatisticsScreen extends React.Component {
    static navigationOptions = {
        headerTitle: "İstatistik",
        tabBarVisible: false
    };

    render() {
        return (
            <View style={{flex:1}}>
                <AppIndex />
            </View>
        );
    }
}

class Kategori extends React.Component {
    render() {
        return (
            <View>
                <Text>kategori</Text>
            </View>
        );
    }
}

class Etiket extends React.Component {
    render() {
        return (
            <View>
                <Text>etiket</Text>
            </View>
        );
    }
}

const AppNavigator = createMaterialTopTabNavigator ({
     KATEGORİ: Kategori,
     ETİKET: Etiket
});

const AppIndex=createAppContainer(AppNavigator);
//export default createAppContainer(AppNavigator);



const styles = StyleSheet.create({
    themeColor: { backgroundColor: "#808080" }
});
export default StatisticsScreen;
