import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from "react-native";
import Header from "../components/Header";
import ChatList from "../components/ChatList";
import {TouchableOpacity} from "react-native";
import {Image} from "react-native";
import {useNavigation} from "@react-navigation/core";
import useAuth from "../hooks/useAuth";
import getMatchedUserInfo from "../lib/getMatchedUserInfo";
import {db} from "../firebase";
import {collection, onSnapshot, orderBy, query} from "@firebase/firestore";


const ChatRow = ({matchDetails}) => {
    const navigation = useNavigation();
    const {user} = useAuth();
    const [matchedUserInfo,setMatchedUserInfo] = useState(null);
    const [lastMessage, setLastMessage] = useState('');


    useEffect(() => {
        setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid))
    },[matchDetails, user]);

    useEffect(
        () =>
            onSnapshot(
                query(
                    collection(db,'matches',matchDetails.id,'messages'),
                    orderBy('timestamp','desc')
                ),
                (snapshot) => setLastMessage(snapshot.docs[0]?.data()?.message)
            ),
        [matchDetails,db]
    );


    return (
        <TouchableOpacity style={styles.container}
                          onPress={() => navigation.navigate('Message',{
                              matchDetails,
                          })}
        >
            <Image style={styles.pic}
                   source={{uri: matchedUserInfo?.photoURL}}
            />

            <View>
                <Text style={styles.user_name}>
                    {matchedUserInfo?.displayName}
                </Text>
                <Text style={styles.msg_text}>{lastMessage || 'Say Hi!'}</Text>
            </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '5%',
        paddingVertical: '4%',
        backgroundColor: 'pink',
        marginVertical: '2%',
        borderRadius: 15,
    },
    pic: {
      borderRadius: 30,
      height: 50,
      width: 50,
      marginRight: 0,
    },
    user_name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: '12%',
    },
    msg_text: {
        marginLeft: '13%',
        color: '#696969',
    }
});
export default ChatRow;
