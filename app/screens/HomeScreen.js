import React, { Component } from 'react';
import { Platform, StyleSheet, View, FlatList, RefreshControl, Modal, TouchableHighlight, StatusBar } from 'react-native';
import { Footer, FooterTab, Button, Text } from 'native-base';
import MyModal from "../components/MyModal";
//var React = require('react-native');
var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({ name: "testDB", createFromLocation: '~testDB.db' });

export class HomeScreen extends React.Component {

    static navigationOptions = {
        headerTitle: "Gelir Gider App"
    };

    componentDidMount() {
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
            gelirData: 0,
            giderData: 0,
            refreshing: false,
            isModalVisible: false,
            choosenData: '',
            dataProps: []
        };
    }

    changeModalVisibility = (bool, item) => {
        this.setState({ isModalVisible: bool });
        this.setState({ dataProps: JSON.stringify(item)});
        //alert(JSON.stringify(item));
    }

    setData = (data) => {
        this.setState({ choosenData: data });
    }

    tum = () => {
        this.setState({
            allData: []
        });
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM veriler ORDER BY id DESC',
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
                <StatusBar backgroundColor="#A9A9A9" barStyle="light-content" />
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
                    renderItem={({ item, index }) => (
                        <View>
                        <TouchableHighlight onPress={() => this.changeModalVisibility(true, item)} underlayColor={"#DCDCDC"}>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
                                <View style={{}}>
                                    {item.aciklama == "" ? (
                                        <Text>{item.tarih}  {item.kategoriAd}</Text>
                                    ) : (
                                            <Text>{item.tarih}  {item.kategoriAd} - {item.aciklama}</Text>
                                        )}
                                </View>
                                <View style={{}}>
                                    {item.gelirMiGiderMi ? (
                                        <Text style={{ color: "green" }}>+{item.miktar} TL</Text>
                                    ) : (
                                            <Text style={{ color: "red" }}>-{item.miktar} TL</Text>
                                        )}
                                </View>   
                            </View>
                        </TouchableHighlight>
                        </View>
                )}/>
                <Modal transparent={true} visible={this.state.isModalVisible} onRequestClose={() => this.changeModalVisibility(false)}
                    animationType='fade'>
                    <MyModal changeModalVisibility={this.changeModalVisibility} setData={this.setData} data={this.state.dataProps} />
                </Modal>
                <Footer>
                    <FooterTab style={{ backgroundColor: "#DCDCDC",  }}>
                        <Button onPress={() => this.props.navigation.navigate('NewData', { title: 'Gelir Ekle', isInEx: 1, headerBgColor: "#3CB371" })}>
                            <Text style={{ color: "black" }}>GELİR EKLE</Text>
                        </Button>
                        <Button onPress={() => this.props.navigation.navigate('Statistics')}>
                            <Text style={{ color: "black" }}>İSTATİSTİK</Text>
                        </Button>
                        <Button onPress={() => this.props.navigation.navigate('NewData', { title: 'Gider Ekle', isInEx: 0, headerBgColor: "#DC143C" })}>
                            <Text style={{ color: "black" }}>GİDER EKLE</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    line: {
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5
    }
});
export default HomeScreen;
