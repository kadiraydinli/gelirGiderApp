import React, { Component } from 'react';
import { Platform, StyleSheet, Image, View } from 'react-native';
import { Container, Header, Content, Item, Input, Button, Text, SwipeRow, Icon } from 'native-base';

export class SearchScreen extends React.Component {
    static navigationOptions = {
        header: null
    };
    render() {
        return (
            <Container>
                <Header searchBar >
                    <Item>
                        <Icon name="ios-search" />
                        <Input placeholder="Arama Yap. Örn: Fatura veya #su" />
                    </Item>
                </Header>
                <Content>
                    <SwipeRow 
                        leftOpenValue={75} 
                        rightOpenValue={-75}
                        left={
                        <Button success onPress={() => alert('Add')}>
                            <Icon active name="add" />
                        </Button>
                        } 
                        body={<View style={{ paddingLeft: 20 }}>
                                <Text>Deneme</Text>
                            </View> } 
                        right={
                        <Button danger onPress={() => alert('Trash')}>
                                <Icon active name="trash" />
                        </Button>
                        } 
                        /> 
                    <SwipeRow
                        leftOpenValue={75}
                        rightOpenValue={-75}
                        left={
                            <Button success onPress={() => alert('Add')}>
                                <Icon active name="add" />
                            </Button>
                        }
                        body={<View style={{ paddingLeft: 20 }}>
                            <Text>Deneme 2</Text>
                        </View>}
                        right={
                            <Button danger onPress={() => alert('Trash')}>
                                <Icon active name="trash" />
                            </Button>
                        }
                    /> 
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
export default SearchScreen;