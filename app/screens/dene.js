import React, { Component } from 'react';
import { Text, Modal, TouchableHighlight, View, Alert, StyleSheet } from 'react-native';
//import MyModal from "../components/MModal";
import MyModal from "../components/MyModal";

export class dene extends React.Component  {
    constructor(props) {
        super(props);

        this.state = {
            isModalVisible: false,
            choosenData: ''
        }
    }

    changeModalVisibility = (bool) => {
        this.setState({ isModalVisible: bool });
    }

    setData = (data) => {
        this.setState({ choosenData: data });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>
                    {this.state.choosenData}
                </Text>
                <TouchableHighlight onPress={() => this.changeModalVisibility(true)} style={[styles.touchableHighlight, { backgroundColor: "orange" }]}
                    underlayColor={"red"}>
                    <Text style={styles.text}>Modal Aç</Text>
                </TouchableHighlight>

                <Modal transparent={true} visible={this.state.isModalVisible} onRequestClose={() => this.changeModalVisibility(false)}
                    animationType='fade'>
                    <MyModal changeModalVisibility={this.changeModalVisibility} setData={this.setData} />
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    touchableHighlight: {
        backgroundColor: "white",
        alignSelf: 'stretch',
        alignItems: 'stretch'
    },
    text: {
        marginVertical: 20,
        fontSize: 20,
        fontWeight: 'bold'
    }
});

export default dene;