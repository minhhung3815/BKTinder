import React, {useLayoutEffect} from 'react';
import {Button, Text, StyleSheet, ImageBackground, View} from 'react-native';
import useAuth from "../hooks/useAuth";
import {useNavigation} from "@react-navigation/core";
import {TouchableOpacity} from "react-native";


const LoginScreen = () => {
    const {signInWithGoogle, loading} = useAuth();
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
           headerShown: false,
        });
    },[]);

    return (
        <View style={styles.container}>
            <ImageBackground
                source={{uri: "https://tinder.com/static/tinder.png"}}
                resizeMode = "cover"
                style = {styles.image}
            >
                <TouchableOpacity style={styles.button_sign} onPress={signInWithGoogle}>
                    <Text style={styles.text}>Sign in & Enjoy</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    )
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        justifyContent: "center"
    },
    button_sign: {
        position: 'absolute',
        bottom: 150,
        width : 100,
        backgroundColor: 'white',
        borderColor: 'black',
        marginHorizontal: '25%',
        padding: 15,
        borderRadius: 15,
    },
    text: {
        color: "black",
        fontWeight: 'bold',
        textAlign: "center",
    },
});
export default LoginScreen;
