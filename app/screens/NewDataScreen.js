import React, { Component } from 'react';
import { Platform, StyleSheet, Image, Picker, View, Dimensions, Switch, FlatList, Button } from 'react-native';
import { Text, Item, Input, List, ListItem } from 'native-base';
//import TagInput from 'react-native-tag-input';

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({ name: "testDB", createFromLocation: '~testDB.db' });

const inputProps = {
    keyboardType: 'default',
    placeholder: 'Etiket',
    autoFocus: false,
    style: {
        fontSize: 14,
        marginVertical: Platform.OS == 'ios' ? 10 : -2,
    },
};

let bol = 0

export class NewDataScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: `${navigation.state.params.title}`,
        tabBarVisible: false
    });

    constructor() {
        super();
        this.state = {
            PickerValue: '',
            switchValue: false,
            text: '',
            emails: '',
            tags: [],
            horizontalTags: [],
            horizontalText: "",
            data: [],
            miktar: 0,
            aciklama: ''
        }
    }

    ekle = () => {
        db.transaction((tx) => {
            tx.executeSql('INSERT INTO veriler (kategoriAd, miktar, gelirMiGiderMi, tekrar, aciklama, etiket)' +
                'VALUES (?, ?, ?, ?, ?, ?)', [this.state.PickerValue, this.state.miktar, 
                    bol, this.state.switchValue,
                this.state.aciklama, this.state.tags]);
            alert(this.state.tags);
        });
    }

    onChangeTags = (tags) => {
        this.setState({ tags });
    }

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

    labelExtractor = (tag) => tag;

    onChangeHorizontalTags = (horizontalTags) => {
        this.setState({
            horizontalTags,
        });
    };

    onChangeHorizontalText = (horizontalText) => {
        this.setState({ horizontalText });

        const lastTyped = horizontalText.charAt(horizontalText.length - 1);
        const parseWhen = [',', ' ', ';', '\n'];

        if (parseWhen.indexOf(lastTyped) > -1) {
            this.setState({
                horizontalTags: [...this.state.horizontalTags, this.state.horizontalText],
                horizontalText: "",
            });
            this._horizontalTagInput.scrollToEnd();
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
        bol = navigation.getParam('bol', 0);
        return (
            <View style={styles.container}>
                <Item style={styles.item}>
                    <Input onChangeText={(aciklama) => this.setState({ aciklama })}
                        value={this.state.aciklama} placeholder='Açıklama' />
                </Item>
                <Picker style={styles.picker}
                    selectedValue={this.state.PickerValue}
                    onValueChange={(itemValue, itemIndex) => this.setState({ PickerValue: itemValue })}>
                    <Picker.Item label="Maaş" value="Maaş" />
                    <Picker.Item label="Sağlık" value="Sağlık" />
                    <Picker.Item label="Giyim" value="Giyim" />
                    <Picker.Item label="Fatura" value="Fatura" />
                    <Picker.Item label="Kira" value="Kira" />
                    <Picker.Item label="Alışveriş" value="Alışveriş" />
                </Picker>
                <Item style={styles.item}>
                    <Text style={styles.textSize}>₺</Text>
                    <Input onChangeText={(miktar) => this.setState({ miktar })}
                        keyboardType="numeric" value={this.state.miktar} placeholder='Miktar' />
                </Item>
                {/*<TagInput
                    value={this.state.tags}
                    onChange={this.onChangeTags}
                    labelExtractor={this.labelExtractor}
                    text={this.state.text}
                    onChangeText={this.onChangeText}
                    tagColor="blue"
                    tagTextColor="white"
                    inputProps={inputProps}
                    maxHeight={75}
                />*/}
                <View style={styles.switch}>
                    <Text style={{  }}>{this.state.switchValue ? 'Açık' : 'Kapalı'} Tekrarla</Text>
                    <Switch value={this.state.switchValue}
                        onValueChange={(switchValue) => this.setState({ switchValue })} />
                </View>
                <Text>{bol}</Text>
                <Button onPress={this.ekle} title="Kaydet" />
            </View>
        );
    }
};

const styles = StyleSheet.create({
    themeColor: { backgroundColor: "#805080" },
    textSize: { fontSize: 20 },
    container: { flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch' },
    item: { alignSelf: "center", marginLeft: "15%", marginRight: "15%", marginBottom: 30 },
    button: { alignSelf: "center", marginLeft: "10%", marginRight: "10%" },
    switch: { flexDirection: "row", alignSelf: "flex-end", marginBottom: 20, right: "13%" },
    picker: { alignSelf: "center", width: "60%", marginBottom: 30 }
});

export default NewDataScreen;