import React, { Component } from 'react';
import { Text, Platform, StyleSheet, ImageBackground, TouchableOpacity, Picker, View, TextInput, Switch, StatusBar, Alert } from 'react-native';
//import TagInput from 'react-native-tag-input';
import Tags from "react-native-tags";
import { ScrollView } from 'react-native-gesture-handler';

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({ name: "testDB", createFromLocation: '~testDB.db' });
let isInEX = 0;

export class NewDataScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: `${navigation.state.params.title}`,
        tabBarVisible: false,
        headerStyle: { backgroundColor: `${navigation.state.params.headerBgColor}`},
        headerTintColor: '#fff',
        headerTitleStyle: {color: "white", fontWeight: "200"}
    });

    constructor() {
        super();
        this.state = {
            PickerValue: '',
            switchValue: false,
            text: '',
            tags: [],
            horizontalTags: [],
            horizontalText: "",
            data: [],
            miktar: '',
            aciklama: '',
            colorM: '',
            colorA: ''
        }
    }

    componentDidMount() {
        if(isInEX) {
            this.setState({
                colorM: '#3CB371',
                colorA: '#a3d9bb'
            });
        }
        else {
            this.setState({
                colorM: '#DC143C',
                colorA: '#eda6b3'
            });
        }
    }

    onChangeTags = (tags) => {
        this.setState({ tags });
    }

    labelExtractor = (tag) => tag;

    onChangeText = (text) => {
        this.setState({ text });

        const lastTyped = text.charAt(text.length - 1);
        const parseWhen = [',', ' ', ';', '\n'];

        if (parseWhen.indexOf(lastTyped) > -1) {
            this.setState({
                tags: [...this.state.tags, this.state.text],
                text: "",
            });
        }
    }

    ekle = () => {
        try {
            if(this.state.miktar != 0) {
                if(this.state.PickerValue != "") {
                    db.transaction((tx) => {
                        tx.executeSql('INSERT INTO veriler (kategoriAd, miktar, gelirMiGiderMi, tekrar, aciklama, etiket)' +
                            'VALUES (?, ?, ?, ?, ?, ?)', [this.state.PickerValue, parseInt(this.state.miktar),
                                isInEX, this.state.switchValue,
                            this.state.aciklama, this.state.tags]);
                    });
                    if (isInEX) Alert.alert("Başarılı", "Gelir Eklendi!");
                    else Alert.alert("Başarılı", "Gider Eklendi!");
                }
                else {
                    Alert.alert("Seçim yap!", "Lütfen bir kategori seçiniz!");
                }
            }
            else
                Alert.alert("Uyarı", "Lütfen miktar giriniz!");
        }
        catch (e) {
            alert("Hata Oluştu");
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

    getDate = () => {
        let today = new Date();
        let date = today.getDate() + "-" + parseInt(today.getMonth() + 1) + "-" + today.getFullYear();
        return "gdg"
    }

    render() {
        const { navigate } = this.props.navigation;
        const { navigation } = this.props;
        isInEX = navigation.getParam('isInEx', 0);
        return (
            <View style={styles.container}>
            <ScrollView>
                {
                    isInEX ? (<StatusBar backgroundColor="#3CB371" barStyle="light-content" />) : 
                        (<StatusBar backgroundColor="#DC143C" barStyle="light-content" />)
                }
                <TextInput style={styles.item} onChangeText={(aciklama) => this.setState({ aciklama })}
                    value={this.state.aciklama} placeholder='Açıklama' underlineColorAndroid="gray" />
                <View style={styles.item}>
                    <Text style={{fontSize:15}}>Kategori Seçiniz</Text>
                    <Picker
                        selectedValue={this.state.PickerValue}
                        onValueChange={(itemValue, itemIndex) => this.setState({ PickerValue: itemValue })}>
                        <Picker.Item label="Lütfen kategori seçiniz" value="" />
                        <Picker.Item label="Maaş" value="Maaş" />
                        <Picker.Item label="Sağlık" value="Sağlık" />
                        <Picker.Item label="Giyim" value="Giyim" />
                        <Picker.Item label="Fatura" value="Fatura" />
                        <Picker.Item label="Kira" value="Kira" />
                        <Picker.Item label="Alışveriş" value="Alışveriş" />
                    </Picker>
                </View>
                <TextInput style={styles.item} onChangeText={(miktar) => this.setState({ miktar })}
                    keyboardType="numeric" value={this.state.miktar} placeholder='Miktar' underlineColorAndroid="gray" />
                <View style={styles.switch}>
                    <Text style={{ right: "50%" }}>Tekrarla</Text>
                    <Switch value={this.state.switchValue}
                        thumbColor={this.state.colorM}
                        trackColor={{ true: [this.state.colorM] }}
                        onValueChange={(switchValue) => this.setState({ switchValue })} />
                </View>
                <View style={{ margin: 50 }}>
                    <TouchableOpacity onPress={this.ekle} style={{ ...styles.button, backgroundColor: [this.state.colorM]}}>
                        <Text style={{ fontSize: 17, color: "white" }}>KAYDET</Text>
                    </TouchableOpacity>
                </View>
                </ScrollView>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", backgroundColor: "#fff" },
    item: { alignSelf: "center", width:"80%", fontSize: 16, margin: 20 },
    button: { height: "10%", borderRadius: 30, padding: 25, justifyContent: "center", alignItems: "center" },
    switch: { flexDirection: "row", alignSelf: "flex-end", margin: 20, right: "7%" },
    picker: { alignSelf: "center", width: "80%", marginBottom: 30, backgroundColor:"#DCDCDC" },
    line: { borderBottomColor: 'gray', borderBottomWidth: 0.5 }
});

export default NewDataScreen;