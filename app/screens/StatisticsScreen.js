import React, { Component } from 'react';
import { Platform, StyleSheet, Image, View, Button, processColor, FlatList } from 'react-native';
import { Container, Header, Content, Text, Left, Icon, Body, Right, Title, Tabs, Tab, TabHeading } from 'native-base';
import { createMaterialTopTabNavigator, createAppContainer } from "react-navigation";
import { PieChart } from 'react-native-charts-wrapper';

var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({ name: "testDB", createFromLocation: '~testDB.db' });

export class StatisticsScreen extends React.Component {
    static navigationOptions = {
        headerTitle: "İstatistik",
        tabBarVisible: false
    };

    constructor() {
        super();
        this.state = {
            veri: []
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
            <AppIndex />
            {/*<Text>{this.state.veri}</Text>
            <Button title="Tıkla" onPress={this.ChangeColorFunction} />
                <FlatList
                    data={this.state.ColorHolder}
                    keyExtractor={((item, index) => index.toString())}
                    renderItem={({ item, index }) => (
                        <Text style={{color: this.state.ColorHolder}}>{item}</Text>
                    )} />*/}
            </View>
            );
        }
    }



class Kategori extends React.Component {
    static navigationOptions = {
        tabBarOptions: {
            activeTintColor: "black",
            inactiveTintColor: "gray",
            style: {
                backgroundColor: '#DCDCDC',
            },
        }
    }

    constructor() {
        super(); 
        this.state = {
            legend: {
                enabled: true,
                textSize: 15,
                form: 'CIRCLE',

                horizontalAlignment: "RIGHT",
                verticalAlignment: "CENTER",
                orientation: "VERTICAL",
                wordWrapEnabled: true
            },
            data: {
                dataSets: [{
                    values: [{ value: 200, label: 'Sandwiches' },],
                    label: '',
                    config: {
                        colors: [processColor('#C0FF8C'), processColor('#FFF78C'), processColor('#FFD08C'), processColor('#8CEAFF'),
                            processColor('#8C7AFF'), processColor('#3333'), processColor('#b2968e'), processColor('#daa045'), 
                            processColor('#4662d3'), processColor('#85f111'), processColor('#b3169d'), processColor('#6a4b23'), 
                            processColor('#c35f69'), processColor('#87e6c0'), processColor('#5a8b4c'), processColor('#6864a0'), 
                            processColor('#8ba054'), processColor('#235873'), processColor('#9d2856'), processColor('#8c3e67'), 
                            processColor('#0579dc'), processColor('#dc850b'), processColor('#c20ebe'), processColor('#03acdc')],
                        valueTextSize: 20,
                        valueTextColor: processColor('black'),
                        sliceSpace: 4,
                        selectionShift: 5,
                        // xValuePosition: "OUTSIDE_SLICE",
                        // yValuePosition: "OUTSIDE_SLICE",
                        valueFormatter: "#.#'%'",
                        valueLineColor: processColor('green'),
                        valueLinePart1Length: 0.5
                    }
                }],
            },
            highlights: [{ x: 2 }],
            description: {
                text: '',
                textSize: 15,
                textColor: processColor('darkgray'),
            }
        };
    }

    componentDidMount() {
        this.veriler();
    }

    veriler = () => {
        db.transaction((tx) => {
            tx.executeSql('SELECT count(kategoriAd) as value, kategoriAd as label FROM veriler GROUP BY kategoriAd',
                [], (tx, results) => {
                    var len = results.rows.length;
                    var veri = JSON.parse(JSON.stringify(this.state.data));
                    for (let i = 0; i < len; i++) {
                        var row = results.rows.item(i);
                        veri.dataSets[0].values[i]=row;
                    }
                    this.setState({ data: veri});
                    console.log(JSON.stringify(veri));
                }
            );
        })        
    }

    handleSelect(event) {
        let entry = event.nativeEvent
        if (entry == null) {
            this.setState({ ...this.state, selectedEntry: null })
        } else {
            this.setState({ ...this.state, selectedEntry: JSON.stringify(entry) })
        }

        console.log(event.nativeEvent)
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <PieChart
                    style={styles.chart}
                    logEnabled={true}
                    chartBackgroundColor={processColor('white')}
                    chartDescription={this.state.description}
                    data={this.state.data}
                    legend={this.state.legend}
                    highlights={this.state.highlights}

                    entryLabelColor={processColor('black')}
                    entryLabelTextSize={20}
                    drawEntryLabels={false}

                    rotationEnabled={false}
                    rotationAngle={45}
                    usePercentValues={true}
                    styledCenterText={{ text: 'Kategori', color: processColor('gray'), size: 20 }}
                    centerTextRadiusPercent={100}
                    holeRadius={40}
                    holeColor={processColor('#f0f0f0')}
                    transparentCircleRadius={45}
                    transparentCircleColor={processColor('#f0f0f088')}
                    maxAngle={360}
                    onSelect={this.handleSelect.bind(this)}
                    onChange={(event) => console.log(event.nativeEvent)}
                />
            </View>
        );
    }
}

class Etiket extends React.Component {
    static navigationOptions = {
        tabBarOptions: {
            activeTintColor: "black",
            inactiveTintColor: "gray",
            style: {
                backgroundColor: '#DCDCDC',
            },
        }
    }

    constructor() {
        super();
        this.state = {
            legend: {
                enabled: true,
                textSize: 15,
                form: 'CIRCLE',

                horizontalAlignment: "RIGHT",
                verticalAlignment: "CENTER",
                orientation: "VERTICAL",
                wordWrapEnabled: true
            },
            data: {
                dataSets: [{
                    values: [{ value: 45, label: 'Sandwiches' },
                    { value: 21, label: 'Salads' },
                    { value: 15, label: 'Apple' },
                    { value: 9, label: 'Beverages' },
                    { value: 15, label: 'Desserts' },
                    { value: 70, label: 'Kadir' }],
                    label: '',
                    config: {
                        colors: [processColor('#C0FF8C'), processColor('#FFF78C'), processColor('#FFD08C'), processColor('#8CEAFF'),
                        processColor('#8C7AFF'), processColor('#3333'), processColor('#b2968e'), processColor('#daa045'),
                        processColor('#4662d3'), processColor('#85f111'), processColor('#b3169d'), processColor('#6a4b23'),
                        processColor('#c35f69'), processColor('#87e6c0'), processColor('#5a8b4c'), processColor('#6864a0'),
                        processColor('#8ba054'), processColor('#235873'), processColor('#9d2856'), processColor('#8c3e67'),
                        processColor('#0579dc'), processColor('#dc850b'), processColor('#c20ebe'), processColor('#03acdc')],
                        valueTextSize: 20,
                        valueTextColor: processColor('black'),
                        sliceSpace: 4,
                        selectionShift: 5,
                        // xValuePosition: "OUTSIDE_SLICE",
                        // yValuePosition: "OUTSIDE_SLICE",
                        valueFormatter: "#.#'%'",
                        valueLineColor: processColor('green'),
                        valueLinePart1Length: 0.5
                    }
                }],
            },
            highlights: [{ x: 2 }],
            description: {
                text: '',
                textSize: 15,
                textColor: processColor('darkgray'),
            }
        };
    }

    handleSelect(event) {
        let entry = event.nativeEvent
        if (entry == null) {
            this.setState({ ...this.state, selectedEntry: null })
        } else {
            this.setState({ ...this.state, selectedEntry: JSON.stringify(entry) })
        }

        console.log(event.nativeEvent)
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <PieChart
                    style={styles.chart}
                    logEnabled={true}
                    chartBackgroundColor={processColor('white')}
                    chartDescription={this.state.description}
                    data={this.state.data}
                    legend={this.state.legend}
                    highlights={this.state.highlights}

                    entryLabelColor={processColor('black')}
                    entryLabelTextSize={20}
                    drawEntryLabels={false}

                    rotationEnabled={false}
                    rotationAngle={45}
                    usePercentValues={true}
                    styledCenterText={{ text: 'Etiket', color: processColor('gray'), size: 20 }}
                    centerTextRadiusPercent={100}
                    holeRadius={40}
                    holeColor={processColor('#f0f0f0')}
                    transparentCircleRadius={45}
                    transparentCircleColor={processColor('#f0f0f088')}
                    maxAngle={360}
                    onSelect={this.handleSelect.bind(this)}
                    onChange={(event) => console.log(event.nativeEvent)}
                />
            </View>
        );
    }
}

const AppNavigator = createMaterialTopTabNavigator ({
     KATEGORİ: Kategori,
     ETİKET: Etiket
});

const AppIndex = createAppContainer(AppNavigator);

const styles = StyleSheet.create({
    chart: {
        flex: 1
    }
});
export default StatisticsScreen;
