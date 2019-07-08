import React, { Component } from 'react';
import { Text, View, Alert, TouchableOpacity, StyleSheet, TouchableHighlight, Dimensions } from 'react-native';

var kat = '';

export default class MyModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            width: Dimensions.get('window').width,
            veriler: JSON.parse(this.props.data)
        };
        Dimensions.addEventListener('change', (e) => {
            this.setState(e.window);
        });

        if (this.state.veriler.gelirMiGiderMi) kat = "#a3d9bb";
        else kat = "#eda6b3";
    }

    closeModal = (data) => {
        this.props.changeModalVisibility(false);
        this.props.setData(data);
    }

    yaz = () => {
        alert(JSON.parse(this.props.data));
        
    }

    render() {
        return(
            <TouchableOpacity setOpacityTo={0.5} activeOpacity={1} disabled={true} style={styles.container}>
                <View style={[styles.modal, { width: this.state.width - 80}]}>
                    {this.state.veriler.gelirMiGiderMi ? (
                        <View style={{ backgroundColor: "#3CB371", borderRadius: 0, padding: 10}}>
                            <Text style={{ fontSize: 25, fontWeight: '500', color: "white", textAlign: "center" }}>Gelir</Text>
                        </View>
                    ) : (
                            <View style={{ backgroundColor: "#DC143C", borderRadius: 0, padding: 7 }}>
                                <Text style={{ fontSize: 25, fontWeight: '500', color: "white", textAlign: "center" }}>Gider</Text>
                        </View>
                    )}
                    <View style={{textAlign: "center", margin: 10}}>
                        <Text style={{fontSize: 20}}>Kategori: {this.state.veriler.kategoriAd}</Text>
                        <Text>Miktar: {this.state.veriler.miktar} TL</Text>
                        <Text>Tarih: {this.state.tarih}</Text>
                        <Text>Etiket: {this.state.veriler.etiket}</Text>
                    </View>
                    <View style={{flexDirection: "row", alignSelf: "center" }}>
                        <TouchableHighlight onPress={() => this.closeModal('Cancel')} style={[styles.touchableHighlight, { backgroundColor: "#DC143C", marginRight: 5 }]} underlayColor={'#f1f1f1'}>
                            <Text style={styles.text}>Sil</Text>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={() => this.closeModal()} style={[styles.touchableHighlight, {backgroundColor: "green", marginLeft: 5}]} underlayColor={'#f1f1f1'}>
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
                        <Text style={[styles.text, {fontSize: 20}]}>{this.state.veriler.id}</Text>
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