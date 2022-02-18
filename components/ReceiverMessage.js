import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from "react-native";
import Header from "../components/Header";
import ChatList from "../components/ChatList";
import {Image} from "react-native";


const ReceiverMessage = ({message}) => {
    return (
        <View style={[styles.container,{alignSelf: 'flex-start'}]}>
            <Image style={styles.image} source={{uri:message.photoURL}}/>
            <Text style={styles.text}>
                {message.message}
            </Text>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'red',
        paddingVertical: '3%',
        paddingHorizontal: '3%',
        marginVertical: '3%',
        marginHorizontal: '15%',
        borderRadius: 15,
    },
    text: {
        color: 'white',
    },
    image: {
        height: 45,
        width: 45,
        borderRadius: 30,
        position: "absolute",
        top: 0,
        left: -55,
    },
});
export default ReceiverMessage;
