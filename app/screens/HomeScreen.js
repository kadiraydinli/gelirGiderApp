import React, { Component } from 'react';
import { Platform, StyleSheet, Image, View, FlatList, RefreshControl } from 'react-native';
import { Footer, FooterTab, Button, Text } from 'native-base';

//var React = require('react-native');
var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({ name: "testDB", createFromLocation: '~testDB.db' });

export class HomeScreen extends React.Component {

    static navigationOptions = {
        headerTitle: "Gelir Gider App"
    };

    componentDidMount() {
        this.tum();
        this.gelirler();
        this.giderler();
    }

    constructor(props) {
        super(props);

        this.state = {
            allData: [],
            gelirData: 0,
            giderData: 0,
            refreshing: false,
            seed: 1
        };
    }

    tum = () => {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM veriler',
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

    gelirler = () => {
        db.transaction((tx) => {
            tx.executeSql('SELECT sum(miktar) as top FROM veriler WHERE gelirMiGiderMi=?',
                [1], (tx, results) => {
                var len = results.rows.length;
                if(len > 0) {
                    var row = results.rows.item(0);
                    this.setState({gelirData: row.top})
                }
                //console.log(results);
                //alert(len);
            });
        });
    }

    giderler = () => {
        db.transaction((tx) => {
            tx.executeSql('SELECT sum(miktar) as top FROM veriler WHERE gelirMiGiderMi=?',
                [0], (tx, results) => {
                    var len = results.rows.length;
                    if (len > 0) {
                        var row = results.rows.item(0);
                        this.setState({giderData: row.top})
                    }
                });
        });
    }

    handleRefresh = () => {
        this.setState({
            refreshing: true,
        }, () => {
            this.tum();
            this.giderler();
            this.gelirler();
        })
    };

    render() {

        return (
            <View style={{ flex: 1, flexDirection: 'column'}}>
                <View style={{ alignItems: "center", margin: "5%"}}>
                    <Text style={{margin: 5, fontSize: 25, color: "black"}}>NET</Text>
                    <Text style={{ fontSize: 30, color: "black"}}>{this.state.gelirData-this.state.giderData} TL</Text>
                    <View style={{flexDirection:"row", justifyContent:"space-around",margin:10}}>
                        <View style={{margin: 5}}>
                            <Text>Gelirler</Text>
                            <Text>{this.state.gelirData} TL</Text>
                        </View>
                        <View style={{ margin: 5 }}>
                            <Text>Giderler</Text>
                            <Text>{this.state.giderData} TL</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.line} />
                <Text style={{ textAlign: "center", margin: "1%", fontSize: 20, color: "black" }}>Son İşlemler</Text>
                <View style={styles.line} />
                <FlatList
                    data={this.state.allData}
                    keyExtractor={((item, index) => index.toString())}
                    refreshControl={
                        <RefreshControl
                            colors={["red"]}
                            tintColor={["red"]}
                            refreshing={this.state.refreshing}
                            onRefresh={() => this.handleRefresh()} />
                    }
                    renderItem={({ item }) => (
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
                            <View style={{  }}>
                                <Text>{item.tarih}  {item.kategoriAd} - {item.aciklama}</Text>
                            </View>
                            <View style={{  }}>
                                {item.gelirMiGiderMi ? (
                                    <Text style={{ color: "green" }}>+{item.miktar} TL</Text>
                                ) : (
                                        <Text style={{ color: "red" }}>-{item.miktar} TL</Text>
                                )}
                            </View>
                        </View>
                )}/>
                <Footer>
                    <FooterTab style={{ backgroundColor: "#DCDCDC",  }}>
                        <Button onPress={() => this.props.navigation.navigate('NewData', {title: 'Gelir Ekle', bol: 1})}>
                            <Text style={{ color: "black" }}>GELİR EKLE</Text>
                        </Button>
                        <Button onPress={() => this.props.navigation.navigate('Statistics')}>
                            <Text style={{ color: "black" }}>İSTATİSTİK</Text>
                        </Button>
                        <Button onPress={() => this.props.navigation.navigate('NewData', { title: 'Gider Ekle', bol: 0 })}>
                            <Text style={{ color: "black" }}>GİDER EKLE</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    themeColor: { backgroundColor: "grey" },
    headerTitle: {
        fontSize: 25,
        color: "#ff7600",
        fontWeight: "bold",
        textAlign: "center"
    },
    headerButton: {
        width: 25,
        height: 25,
    },
    textColor: {
        color: "#FFFF"
    },
    line: {
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5
    }
});
export default HomeScreen;
