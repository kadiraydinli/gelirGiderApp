import React, { Component } from 'react';
import { Platform, StyleSheet, Image, Picker, View, Dimensions, Switch, ScrollView } from 'react-native';
import {
    Container, Header, Content, Text, Footer, FooterTab, Left, Body,
    Right, Title, Icon, Card, CardItem, List, ListItem, H1, H2, Item, H3
} from 'native-base';
//import { Provider as PaperProvider, Button } from 'react-native-paper';

export class dene extends React.Component  {
    static navigationOptions = {
        header: null
    }

    constructor() {
        super();
        this.state = {
            PickerValue: '',
            switchValue: false
        }
    }

    clickMe = () => {
        var data = this.state.PickerValue;
        if (data == "") {
            alert("Lütfen kategori seçiniz.");
        }
        else {
            alert(data);
        }
    }

    render() {
        return (
            <View></View>
        );
    }
};

/*
<PaperProvider>
                <Button icon="add-a-photo" mode="contained" onPress={() => console.log('Pressed')}>
                    Press me</Button>
            </PaperProvider>*/

const styles = StyleSheet.create({
    themeColor: { backgroundColor: "#808080" },
    textSize: {fontSize: 20}
});

export default dene;