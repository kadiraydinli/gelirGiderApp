import React, { Component } from 'react';
import { Text, StyleSheet, TouchableOpacity, Picker, View, TextInput, Switch, StatusBar, Alert, ScrollView } from 'react-native';

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({ name: "testDB", createFromLocation: '~testDB.db' });
let isInEX = 0;

var PickerItem = Picker.Item;

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
            picker: '', //Kategoriler
            check: false, //Tekrarla
            data: [],
            pay: '',
            explanation: '',
            color: '',
            colorBg: '',
            categories: []
        }
    }

    componentDidMount() {
        if(isInEX) {
            this.setState({
                color: '#3CB371',
                colorBg: '#a3d9bb'
            });
        }
        else {
            this.setState({
                color: '#DC143C',
                colorBg: '#eda6b3'
            });
        }

        this.getCategory();
    }

    insertEntry = () => {
        try {
            if(this.state.pay != 0) {
                if(this.state.picker != "") {
                    db.transaction((tx) => {
                        tx.executeSql('INSERT INTO entries (categoryId, pay, isInEx, again, explanation, date)' +
                            'VALUES (?, ?, ?, ?, ?, ?)', [this.state.picker, parseInt(this.state.pay),
                                isInEX, this.state.check, this.state.explanation, this.state.date], (tx, result) => {
                                    if (isInEX) Alert.alert("Başarılı", "Gelir Eklendi!");
                                    else alert("Başarılı", "Gider Eklendi!");    
                                });
                    });
                }
                else {
                    Alert.alert("Seçim yap!", "Lütfen bir kategori seçiniz!");
                }
            }
            else
                Alert.alert("Uyarı", "Lütfen miktar giriniz!");
        }
        catch (e) {
            Alert.alert("Hata Oluştu", "Lütfen tekrar deneyin!");
        }
    }

    getCategory = () => {
        this.setState({ categories: [] });
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM categories',
                [], (tx, results) => {
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        var row = results.rows.item(i);
                        this.state.categories.push(row);
                    }
                });
        });
    }

    render() {
        const { navigate } = this.props.navigation;
        const { navigation } = this.props;
        isInEX = navigation.getParam('isInEx', 0);

        let category = this.state.categories.map((item,index) => {
            return <Picker.Item key={index} value={item.id} label={item.categoryName} />
        })
        return (
            <View style={styles.container}>
                {
                    isInEX ? (<StatusBar backgroundColor="#3CB371" barStyle="light-content" />) :
                        (<StatusBar backgroundColor="#DC143C" barStyle="light-content" />)
                }
                <ScrollView>
                    <TextInput style={styles.item} onChangeText={(explanation) => this.setState({ explanation })}
                        value={this.state.explanation} placeholder='Açıklama' underlineColorAndroid="gray" />
                    <View style={styles.item}>
                        <Text style={{ fontSize: 15 }}>Kategori Seçiniz</Text>
                        <Picker
                            selectedValue={this.state.picker}
                            onValueChange={(itemValue, itemIndex) => this.setState({ picker: itemValue })}>
                            <Picker.Item label="Lütfen kategori seçiniz" value="" />
                            {category}
                        </Picker>
                    </View>
                    <TextInput style={styles.item} onChangeText={(pay) => this.setState({ pay })}
                        keyboardType="numeric" value={this.state.pay} placeholder='Miktar' underlineColorAndroid="gray" />
                    <View style={styles.check}>
                        <Text style={{ right: "50%" }}>Tekrarla</Text>
                        <Switch value={this.state.check}
                            thumbColor={this.state.color}
                            trackColor={{ true: [this.state.colorBg] }}
                            onValueChange={(check) => this.setState({ check })} />
                    </View>
                    <View style={{ margin: 50 }}>
                        <TouchableOpacity onPress={this.insertEntry} style={{ ...styles.button, backgroundColor: [this.state.color]}}>
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
    check: { flexDirection: "row", alignSelf: "flex-end", margin: 20, right: "7%" },
    //picker: { alignSelf: "center", width: "80%", marginBottom: 30, backgroundColor:"#DCDCDC" },
    line: { borderBottomColor: 'gray', borderBottomWidth: 0.5 }
});

export default NewDataScreen;