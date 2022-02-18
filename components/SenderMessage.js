import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from "react-native";
import Header from "../components/Header";
import ChatList from "../components/ChatList";


const SenderMessage = ({message}) => {
    return (
        <View style={[styles.container,{alignSelf: 'flex-start', marginLeft: 'auto'}]}>
            <Text style={styles.text}>
                {message.message}
            </Text>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'purple',
        paddingVertical: '3%',
        paddingHorizontal: '3%',
        marginVertical: '3%',
        marginHorizontal: '2%',
        borderRadius: 15,
    },
    text: {
        color: 'white',
    },
});
export default SenderMessage;
