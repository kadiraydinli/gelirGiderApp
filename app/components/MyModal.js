import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TouchableHighlight, Dimensions } from 'react-native';

export default class MyModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            width: Dimensions.get('window').width,
            entries: JSON.parse(this.props.data)
        };

        Dimensions.addEventListener('change', (e) => {
            this.setState(e.window);
        });

        if (this.state.entries.isInEx) { isInEx = "#3CB371"; isInExText = "Gelir"; }
        else { isInEx = "#DC143C"; isInExText = "Gider"; }
    }

    closeModal = (data) => {
        if(data != 'OK') {
            
            this.props.deleteEntry(data);
        }
        this.props.changeModalVisibility(false);
    }

    render() {
        entries = this.state.entries;
        return(
            <TouchableOpacity setOpacityTo={0.5} activeOpacity={1} disabled={true} style={styles.container}>
                <View style={[styles.modal, { width: this.state.width - 80}]}>
                    <View style={{ backgroundColor: isInEx, borderRadius: 0, padding: 10 }}>
                        <Text style={{ fontSize: 25, fontWeight: '500', color: "white", textAlign: "center" }}>{isInExText}</Text>
                    </View>
                    <View style={{textAlign: "center", margin: 10}}>
                        <Text style={{fontSize: 20}}>Kategori: {entries.category}</Text>
                        <Text>Miktar: {entries.pay} TL {entries.id}</Text>
                        <Text>Tarih: {entries.date}</Text>
                    </View>
                    <View style={{flexDirection: "row", alignSelf: "center" }}>
                        <TouchableHighlight onPress={() => this.closeModal(entries.id)} style={[styles.touchableHighlight, { backgroundColor: "#DC143C", marginRight: 5 }]} underlayColor={'#f1f1f1'}>
                            <Text style={styles.text}>Sil</Text>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={() => this.closeModal('OK')} style={[styles.touchableHighlight, {backgroundColor: "green", marginLeft: 5}]} underlayColor={'#f1f1f1'}>
                            <Text style={styles.text}>Tamam</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

/*
<View style={styles.textView}>
                        <Text style={[styles.text, {fontSize: 20}]}>{this.state.entries.id}</Text>
                        <Text style={styles.text}>Modal Text</Text>
                    </View>
                    <View style={styles.buttonsView}>
                        <TouchableHighlight onPress={() => this.closeModal('Cancel')} style={styles.touchableHighlight} underlayColor={'#f1f1f1'}>
                            <Text style={[styles.text, {color: 'white'}]}>Cancel</Text>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={() => this.yaz()} style={styles.touchableHighlight} underlayColor={'#f1f1f1'}>
                            <Text style={[styles.text, { color: 'white' }]}>OK</Text>
                        </TouchableHighlight>
                    </View>
*/

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: "gray",
    },
    modal: {
        height: "45%",
        //margin: 20,
        //paddingTop: 10,
        //alignSelf: 'center',
        //alignItems: 'center',
        //textAlign: 'center',
        //borderRadius: 10,
        backgroundColor: "#DCDCDC"
    },
    text: {
        margin: 5,
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white'
    },
    touchableHighlight: {
        paddingVertical: 5,
        //alignSelf: 'stretch',
        alignItems: 'center',
        //borderRadius: 10,
        width:"45%"
    }
});