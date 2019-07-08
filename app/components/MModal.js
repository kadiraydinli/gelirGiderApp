import React, { Component } from 'react';
import { Text, View, Alert, Modal, TouchableHighlight, StyleSheet } from 'react-native';
import SimpleModal from "./MyModal";

export default class MModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isModalVisible: false,
            choosenData: ''
        }
    }

    changeModalVisibility = (bool) => {
        this.setState({isModalVisible: bool});
    }

    setData = (data) => {
        this.setState({choosenData: data});
    }

    render() {
        return(
            <View style={styles.container}>
                <Text style={styles.text}>
                    {this.state.choosenData}
                </Text>
                <TouchableHighlight onPress={() => this.changeModalVisibility(true)} style={[styles.touchableHighlight, {backgroundColor: "orange"}]}
                underlayColor={"#f1f1f1"}>
                    <Text style={styles.text}>Modal Aç</Text>
                </TouchableHighlight>

                <Modal transparent={true} visible={this.state.isModalVisible} onRequestClose={() => this.changeModalVisibility(false)}
                    animationType='fade'>
                    <SimpleModal changeModalVisibility={this.changeModalVisibility} setData={this.setData} />
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