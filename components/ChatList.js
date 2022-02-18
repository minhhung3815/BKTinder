import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {collection, onSnapshot, query, where} from "@firebase/firestore";
import {db} from "../firebase";
import useAuth from "../hooks/useAuth";
import ChatRow from "./ChatRow";

const ChatList = () => {
    const[matches,setMatches] = useState([]);
    const {user} = useAuth();

    useEffect (
        ()=>
        onSnapshot(
            query(
                collection(db,'matches'),
                where('usersMatched','array-contains',user.uid)
            ),
            (snapshot) =>
                setMatches(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                )
        ),[user]);


    return (
        matches.length > 0 ? (

        <FlatList style={styles.chat_row}
                  data={matches}
                  keyExtractor={item => item.id}
                  renderItem={({item}) => <ChatRow matchDetails={item}/>}
        /> ) : (
            <View style={styles.sad_container}>
                <Text style={styles.sad_text}>No matches at the moment </Text>
            </View>
        )
    )
};

const styles = StyleSheet.create({
    container: {
    },
    sad_container: {
        padding: '50%',
    },
    sad_text: {
       textAlign: 'center',
       fontSize: 30,
    },
    chat_row: {
        height: '100%',
    },
});
export default ChatList;
