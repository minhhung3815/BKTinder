import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from "react-native";
import {Foundation, Ionicons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/core";



const Header = ({title, callEnabled}) => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <View style={styles.container2}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back_butt}>
                    <Ionicons name='chevron-back-outline' size={34} color='#FF5864'/>
                </TouchableOpacity>
                <Text style={styles.chat}>{title}</Text>
            </View>

            {callEnabled && (
                <TouchableOpacity style={styles.calls}>
                    <Foundation style={styles.call_icon} name='telephone' size={20} color="red"/>
                </TouchableOpacity>
            )}
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        paddingTop: '14%',
        paddingLeft: '2%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
    },
    container2: {
        flexDirection:'row',
        alignItems:'center',
    },
    back_butt: {

    },
    chat: {
        fontSize: 23,
        fontWeight: 'bold',
        color: 'black',
    },
    calls: {
        borderRadius: 30,
        marginRight: "5%",
        paddingVertical: 7,
        paddingHorizontal:10,
        backgroundColor: "#FFB6C1",
    },
    call_icon: {

    },
});
export default Header;
