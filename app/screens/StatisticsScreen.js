import React, { Component } from 'react';
import { StyleSheet, View, Text, processColor, Image, Picker } from 'react-native';
import { PieChart } from 'react-native-charts-wrapper';

var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({ name: "testDB", createFromLocation: '~testDB.db' });

export class StatisticsScreen extends React.Component {
    static navigationOptions = {
        headerTitle: "İstatistik",
        tabBarVisible: false
    };

    _isMounted = false;

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
                    values: [],
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
            },
            veri: [],
            isThereEntry: 1,
            isCountSum: 1
        };
    }

    componentDidMount() {
        this._isMounted = true;
        if(this._isMounted) this.entries();
    }

    componentWillUnmount() {
        this._isMounted = false;

    }

    entries = (pickerValue) => {
        this.setState({ isCountSum: pickerValue });
        db.transaction((tx) => {
            tx.executeSql('SELECT ' + `${parseInt(this.state.isCountSum) ?
                ('count(categories.categoryName)') : ('sum(entries.pay)')}` + ' as value, categories.categoryName as label ' +
                'FROM entries INNER JOIN categories ON categories.id=entries.categoryId GROUP BY entries.categoryId',
                [], (tx, results) => {
                    var len = results.rows.length;
                    var veri = JSON.parse(JSON.stringify(this.state.data));
                    if (len == 0) this.setState({ isThereEntry: 0 });
                    for (let i = 0; i < len; i++) {
                        var row = results.rows.item(i);
                        veri.dataSets[0].values[i] = row;
                    }
                    this.setState({ data: veri });
                    
                }
            );
        });
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
            <View style={styles.container}>
                {this.state.isThereEntry ? (
                    <View style={styles.container}>
                        <Picker
                            selectedValue={this.state.isCountSum}
                            onValueChange={(itemValue, itemIndex) => this.entries(itemValue)}>
                            <Picker.Item label="Kategoriye Göre" value="1" />
                            <Picker.Item label="Para Miktarına Göre" value="0" />
                        </Picker>
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
                            styledCenterText={{ text: `${parseInt(this.state.isCountSum) ? ('Kategoriye Göre') : ('Para Miktarına Göre')}`, 
                                color: processColor('gray'), size: 20 }}
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
                ) : (
                    <View style={styles.noData}>
                        <Image source={require("../icons/sad.png")} style={styles.sad} />
                        <Text style={styles.noDataText}>
                            Gelir ve giderlerinizin grafiksel hali burada görüntülenecek. 
                            Henüz gelir veya gider eklenmemiş. 
                            Gelir veya gider eklemek için ana ekrana gidin.
                        </Text>
                    </View>
                )}
            </View>
        );
    }
};

const styles = StyleSheet.create({
    chart: {
        flex: 1
    },
    container: {
        flex: 1,
        margin: 10
    },
    sad: {
        width: 128,
        height: 128,
        tintColor: 'gray'
    },
    noDataText: {
        textAlign: 'center',
        fontSize: 16
    },
    noData: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -50
    }
});

export default StatisticsScreen;
