import React, { Component } from 'react';
import { StyleSheet, View, FlatList, RefreshControl, TouchableHighlight, TouchableOpacity, StatusBar, Image, Alert } from 'react-native';
import { Footer, FooterTab, Button, Text } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MyModal from "../components/MyModal";

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({ name: "testDB", createFromLocation: '~testDB.db' });

export class HomeScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: "Gelir Gider App",
        headerRight: (
            <TouchableOpacity style={{ right: "10%", padding: 5 }} onPress={() => navigation.navigate("Settings")}>
                <Icon name="settings" size={25} />
            </TouchableOpacity>
        ),
    });

    componentDidMount() {
        this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.handleRefresh();
            }
        );
    }

    componentWillUnmount() {
        this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.handleRefresh();
            }
        );
    }

    constructor(props) {
        super(props);

        this.state = {
            allData: [],
            revenueData: 0, //Gelirler
            expenseData: 0, //Giderler
            refreshing: false,
            isModalVisible: false,
            sendDataProps: [],
            loadingFlat: true
        };
    }

    changeModalVisibility = (bool, item) => {
        this.setState({ isModalVisible: bool });
        this.setState({ sendDataProps: JSON.stringify(item)});
    }

    allEntries = () => { //Tüm Veriler
        this.setState({ 
            allData: [],
            loadingFlat: false
        });
        db.transaction((tx) => {
            tx.executeSql('SELECT entries.id, explanation, pay, date, again, isInEx, categories.categoryName as ' +
            'category FROM entries INNER JOIN categories ON entries.categoryId=categories.id ORDER BY entries.id DESC',
                [], (tx, results) => {
                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                    var row = results.rows.item(i);
                    this.state.allData.push(row);
                }
            });
        });
        this.setState({refreshing: false});
    }

    revenues = () => { //Gelirler
        db.transaction((tx) => {
            tx.executeSql('SELECT SUM(pay) as top FROM entries WHERE isInEx=?',
                [1], (tx, results) => {
                var len = results.rows.length;
                if(len > 0) {
                    var row = results.rows.item(0);
                    this.setState(row.top != null ? ({ revenueData: row.top }): ({ revenueData: 0 }))
                }
            });
        });
    }

    expenses = () => { //Giderler
        db.transaction((tx) => {
            tx.executeSql('SELECT sum(pay) as top FROM entries WHERE isInEx=?',
                [0], (tx, results) => {
                    var len = results.rows.length;
                    if (len > 0) {
                        var row = results.rows.item(0);
                        this.setState(row.top != null ? ({ expenseData: row.top }) : ({ expenseData: 0 }))
                    }
                });
        });
    }

    deleteEntry = (data) => {
        this.setState({ allData: [] });
        db.transaction((tx) => {
            tx.executeSql('DELETE FROM entries WHERE id=?', [data], (tx, result) => {
                this.handleRefresh();
            });
        });
    }

    handleRefresh = () => {
        this.setState({
            refreshing: true,
        }, () => {
            this.allEntries();
            this.revenues();
            this.expenses();
        })
    };

    noItemDisplay() {
        if(this.state.loadingFlat) {
            return(
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
                        Gelir ve giderleriniz burada listelenecek.
                        Eklenmiş gelir veya gider bulunmamakta.
                        Lütfen gelir veya gider ekleyin.
                    </Text>
                </View>
            );
        }
    }

    modal(item) {
        Alert.alert(
            `${item.isInEx ? ("Gelir"): ("Gider")}`,
            'Kategori: ' + item.category + "\n" +
            `${item.explanation != "" ? ('Açıklama: ' + item.explanation + '\n'): ""}` +
            'Miktar: ' + item.pay + ' TL\n' +
            `${item.again ? ("Her ay tekrarlanıyor.") : ("")}`,
            [
                {
                    text: 'Sil',
                    onPress: () => this.deleteEntry(item.id)
                },
                { text: 'Tamam', onPress: () => console.log('Tamam') },
            ],
            { cancelable: false },
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#A9A9A9" barStyle="light-content" />
                <View style={{ alignItems: "center", margin: "5%"}}>
                    <Text style={{margin: 5, fontSize: 25, color: "black"}}>NET</Text>
                    <Text style={{ fontSize: 30, color: "black"}}>{this.state.revenueData-this.state.expenseData} TL</Text>
                    <View style={{flexDirection:"row", justifyContent:"space-around",margin:10}}>
                        <View style={{margin: 5}}>
                            <Text>Gelirler</Text>
                            <Text>{this.state.revenueData} TL</Text>
                        </View>
                        <View style={{ margin: 5 }}>
                            <Text>Giderler</Text>
                            <Text>{this.state.expenseData} TL</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.line} />
                <Text style={{ textAlign: "center", margin: "1%", fontSize: 20, color: "black" }}>Son İşlemler</Text>
                <View style={styles.line} />
                <FlatList ListEmptyComponent={() => this.noItemDisplay()}
                    data={this.state.allData} keyExtractor={((item, index) => index.toString())}
                    refreshControl={
                        <RefreshControl colors={["red"]} tintColor={["red"]} refreshing={this.state.refreshing}
                            onRefresh={() => this.handleRefresh()} />
                        }
                    renderItem={({ item, index }) => (
                        <View>
                        <TouchableHighlight onPress={() => this.modal(item)} underlayColor={"#DCDCDC"}>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
                                <View>
                                    {item.explanation == "" ? (<Text>{item.date}  {item.category}</Text>) : (
                                        <Text>{item.date}  {item.category} - {item.explanation}</Text>)}
                                </View>
                                <View>{item.isInEx ? (<Text style={{ color: "green" }}>+{item.pay} TL</Text>) : (
                                        <Text style={{ color: "red" }}>-{item.pay} TL</Text>)}
                                </View>   
                            </View>
                        </TouchableHighlight>
                        </View>
                )}/>
                <Footer>
                    <FooterTab style={{ backgroundColor: "#DCDCDC",  }}>
                        <Button onPress={() => this.props.navigation.navigate('NewData', { title: 'Gelir Ekle', isInEx: 1, headerBgColor: "#3CB371" })}>
                            <Text style={styles.footerButton}>GELİR EKLE</Text>
                        </Button>
                        <Button onPress={() => this.props.navigation.navigate('Statistics')}>
                            <Text style={styles.footerButton}>İSTATİSTİK</Text>
                        </Button>
                        <Button onPress={() => this.props.navigation.navigate('NewData', { title: 'Gider Ekle', isInEx: 0, headerBgColor: "#DC143C" })}>
                            <Text style={styles.footerButton}>GİDER EKLE</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    line: {
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5
    },
    footerButton: {
        color: 'black'
    }
});
export default HomeScreen;
