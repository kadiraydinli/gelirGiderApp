import React, { Component } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity, Alert, FlatList, Image, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({ name: "testDB", createFromLocation: '~testDB.db' });

export class SettingsScreen extends React.Component {
    static navigationOptions = {
        headerTitle: 'Ayarlar',
        tabBarVisible: false,
        headerRight: (
            <TouchableOpacity style={{ right: "10%", padding: 5 }} 
                onPress={() => Alert.alert("Gelir Gider App", "Gelir ve giderlerinizi takip edebileceğiniz uygulama.\n\nKadir Aydınlı")}>
                <Icon name="information-outline" size={25} />
            </TouchableOpacity>
        ),
    };

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            categories: [],
            loadingFlat: false,
            refreshing: false,
        }
    }

    componentDidMount() {
        this.getCategories();
    }

    insertCategory = () => {
        try {
            var nameTrim = this.state.name.trim();
            if(nameTrim != '') {
                db.transaction((tx) => {
                    tx.executeSql('INSERT INTO categories (categoryName) VALUES (?)',
                        [nameTrim], () => {
                            this.handleRefresh();
                            this.setState({ name: '' })
                            Alert.alert("Başarılı", nameTrim + " kategorilere eklendi.");
                        });
                });
            }
            else    Alert.alert("Uyarı", "Lütfen kategori adı yazınız.");
        }
        catch (e) {
            Alert.alert("Hata Oluştu", "Lütfen tekrar deneyin!\n\n"+ e);
        }
    }

    getCategories() {
        this.setState({
            categories: [],
            loadingFlat: false
        });
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM categories', [], (tx, results) => {
                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                    var row = results.rows.item(i);
                    this.state.categories.push(row);
                }
            });
        });
        this.setState({ refreshing: false });
    }

    delCategory(id, value) {
        Alert.alert(
            "Sil",
            "\'" + value + "\' kategorisini silmek istediğinizden emin misiniz?", [
                {
                    text: "Hayır", onPress: () => console.log("Silinmedi")
                },
                {
                    text: "Evet",
                    onPress: () => 
                    db.transaction((tx) => {
                        tx.executeSql('DELETE FROM categories WHERE id=?', [id], () => {
                            this.getCategories();
                        });
                    })
                }
            ],
            { cancelable: false }
        );
    }

    noItemDisplay() {
        if (this.state.loadingFlat) {
            return (
                <View style={{ alignItems: "center", margin: "15%" }}>
                    <Text>Veriler Yükleniyor...</Text>
                </View>
            );
        }
        else {
            return (
                <View style={{ alignItems: "center", margin: "15%" }}>
                    <Image source={require("../icons/sad.png")} style={{ width: 64, height: 64, bottom: "11%", tintColor: 'gray' }} />
                    <Text style={{ fontSize: 15, textAlign: "center" }}>
                        Kategoriniz bulunmamakta. Lütfen kategori ekleyiniz.
                    </Text>
                </View>
            );
        }
    }

    handleRefresh = () => {
        this.setState({
            refreshing: true,
        }, () => {
            this.getCategories();
        })
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={{margin: 7}}>
                    <Text style={{fontSize: 16, left: "2%"}}>Yeni Kategori Ekle</Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                        <TextInput style={styles.item} onChangeText={(name) => this.setState({ name })}
                            value={this.state.name} placeholder='Kategori Adı' underlineColorAndroid="gray" />
                        <TouchableOpacity onPress={this.insertCategory} style={styles.button}>
                            <Text style={{ fontSize: 17, color: "white" }}>KAYDET</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.line} />
                <Text style={{ textAlign: "center", margin: "1%", fontSize: 16, color: "black" }}>Kategoriler</Text>
                <View style={styles.line} />
                <FlatList
                    ListEmptyComponent={() => this.noItemDisplay()}
                    data={this.state.categories}
                    keyExtractor={((item, index) => index.toString())}
                    refreshControl={
                        <RefreshControl
                            colors={["red"]}
                            tintColor={["red"]}
                            refreshing={this.state.refreshing}
                            onRefresh={() => this.handleRefresh()} />
                    } renderItem={({ item, index }) => (
                    <View>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', margin: 14 }}>
                            <Text style={{fontSize: 16}}>{item.categoryName}</Text>
                            <TouchableOpacity onPress={() => this.delCategory(item.id, item.categoryName)}>
                                <Icon name="delete" size={25} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )} />
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 0
    },
    line: {
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5
    },
    item: {
        width: "70%",
        fontSize: 16,
    },
    button: {
        height: "5%",
        borderRadius: 30,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "green"
    },
    line: { borderBottomColor: 'gray', borderBottomWidth: 0.5 }
});

export default SettingsScreen;