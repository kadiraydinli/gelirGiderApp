import React, { Component } from 'react';
import { Platform, StyleSheet, Image, Picker, View, Dimensions, Switch } from 'react-native';
import { Button, Text, Item, Input } from 'native-base';

export class ExpenseScreen extends React.Component {
    static navigationOptions = {
        headerTitle: "Gider Ekle",
        tabBarVisible: false
    };

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
            <View style={styles.container}>
                <Picker style={styles.picker}
                    selectedValue={this.state.PickerValue}
                    onValueChange={(itemValue, itemIndex) => this.setState({ PickerValue: itemValue })}>
                    <Picker.Item label="Lütfen kategori seçiniz" value="" />
                    <Picker.Item label="deneme1" value="Deneme 1" />
                    <Picker.Item label="deneme2" value="Deneme 2" />
                    <Picker.Item label="deneme3" value="Deneme 3" />
                    <Picker.Item label="deneme4" value="Deneme 4" />
                </Picker>
                <Item style={styles.item}>
                    <Text style={styles.textSize}>₺</Text>
                    <Input placeholder='Miktar' />
                </Item>
                <Item style={styles.item}>
                    <Text style={styles.textSize}>#</Text>
                    <Input placeholder='Etiket' />
                </Item>
                <View style={styles.switch}>
                    <Text style={{ right: "40%" }}>Tekrarla</Text>
                    <Switch value={this.state.switchValue}
                        onValueChange={(switchValue) => this.setState({ switchValue })} />
                </View>
                <Button rounded block onPress={this.clickMe} style={styles.button}>
                    <Text>Kaydet</Text>
                </Button>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    themeColor: { backgroundColor: "#805080" },
    textSize: { fontSize: 20 },
    container: { flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch' },
    item: { alignSelf: "center", marginLeft: "15%", marginRight: "15%", marginBottom: 30 },
    button: { alignSelf: "center", marginLeft: "10%", marginRight: "10%" },
    switch: { flexDirection: "row", alignSelf: "flex-end", marginBottom: 20, right: "13%" },
    picker: { alignSelf: "center", width: "60%", marginBottom: 30 }
});
export default ExpenseScreen;
