import React from 'react';
import {Text, View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {useNavigation, useRoute} from "@react-navigation/core";


const MatchScreen = () => {
    const navigation = useNavigation();
    const {params} = useRoute();

    const{loggedInProfile, userSwiped} = params;

    return (
        <View style={styles.container}>
            <View style={styles.imgs}>
                <Image style={styles.love_pic} source={{uri: 'https://img.wattpad.com/6d88d144abdfc76a91ce52256657c45437d778a3/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f2d345943354b4a4a66722d7136413d3d2d3433303735343237392e313463623138613234623035323534323334383637373531393132372e706e67?s=fit&w=720&h=720'}}/>
            </View>

            <Text style={styles.l_text}>
                You and {userSwiped.displayName} have loved each other
            </Text>

            <View style={styles.pics}>
                <Image style={styles.pros} source={{uri: loggedInProfile.photoURL}}/>
                <Image style={styles.pros} source={{uri: userSwiped.photoURL}}/>
            </View>
            <TouchableOpacity style={styles.msg}
                              onPress={() => {
                                  navigation.goBack();
                                  navigation.navigate("Chat");
                              }}
            >
                <Text style={styles.text}> Send a message </Text>
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: '#FFB6C1',
        paddingTop: '20%',
    },
    love_pic: {
        height: 100,
        width: '100%',
        padding: '20%',
    },
    imgs: {
        justifyContent: 'center',
        paddingLeft: '10%',
        paddingRight:'10%',
        paddingTop: '20%',
    },
    l_text: {
        color: 'black',
        textAlign: 'center',
        marginTop: '0%',
    },
    pics: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: '20%',
    },
    pros: {
        height: 120,
        width: 120,
        borderRadius: 60,
    },
    msg: {
        position: 'absolute',
        bottom: 150,
        width : '70%',
        backgroundColor: 'white',
        borderColor: 'black',
        marginHorizontal: '25%',
        padding: 15,
        borderRadius: 15,
        textAlign: 'center',
    },
    text: {
        color: "black",
        fontWeight: 'bold',
        textAlign: "center",
    },
});
export default MatchScreen;
