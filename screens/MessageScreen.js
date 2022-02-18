import React, {useEffect, useState} from 'react';
import {Button, FlatList, Keyboard, Platform, StyleSheet, Text, View} from 'react-native';
import Header from "../components/Header";
import {SafeAreaView} from "react-native";
import getMatchedUserInfo from "../lib/getMatchedUserInfo";
import useAuth from "../hooks/useAuth";
import {useRoute} from "@react-navigation/core";
import {TextInput} from "react-native";
import {KeyboardAvoidingView} from "react-native";
import {TouchableWithoutFeedback} from "react-native";
import ReceiverMessage from "../components/ReceiverMessage";
import SenderMessage from "../components/SenderMessage";
import {addDoc, collection, onSnapshot, orderBy, query, serverTimestamp} from "@firebase/firestore";
import {db} from "../firebase";
import {TouchableOpacity} from "react-native";



const MessageScreen = () => {
    const {user} = useAuth();
    const {params} = useRoute();
    const {matchDetails} = params;
    const [input, setInput] = useState();
    const [messages, setMessages] = useState([]);

    const incompleteForm = !input;

    useEffect(() =>
        onSnapshot(
            query(
                collection(db,'matches',matchDetails.id,'messages'),
                orderBy('timestamp', 'desc')
            ), snapshot => setMessages(snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })))
        )
    ,[matchDetails, db]);



    const sendMessage = () => {
        addDoc(collection(db,'matches',matchDetails.id,'messages'), {
            timestamp: serverTimestamp(),
            userId: user.uid,
            displayName: user.displayName,
            photoURL: matchDetails.users[user.uid].photoURL,
            message: input,
        });

        setInput("");
    };


    return (
        <SafeAreaView style={styles.container}>
            <Header title={getMatchedUserInfo(matchDetails?.users, user.uid).displayName} callEnabled/>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style = {styles.keyboard}
                returnKeyType = "none"
                keyboardVerticalOffset={10}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <FlatList data={messages}
                              inverted={-1}
                              style={styles.texts}
                              keyExtractor={item => item.id}
                              renderItem={({item: message}) => message.userId === user.uid? (
                                  <SenderMessage key = {message.id} message={message}/>
                              ) : (
                                  <ReceiverMessage key = {message.id} message={message} />
                              )}
                    />
                </TouchableWithoutFeedback>
                <View style={styles.text_chat}>
                    <TextInput style={styles.input}
                               placeholder= "Send a message...."
                               onChangeText={setInput}
                               onSubmitEditing={sendMessage}
                               value={input}
                    />
                    <TouchableOpacity disabled={incompleteForm} style = {styles.button} onPress={sendMessage}>
                        <Text style={[styles.updateW, incompleteForm ? styles.incomplete : styles.complete]}>
                            Send
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    input: {
        height: '100%',
        fontSize: 15,
        width: '88%',
        backgroundColor: 'white',
    },
    text_chat: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: 'gray',
        paddingVertical: '10%',
    },
    keyboard: {
        flex: 1,
    },
    texts: {
        paddingLeft: '2%',
    },
    updateW: {
        textAlign: 'center',
        fontSize: 15,
        color: 'white',
    },
    incomplete: {
        backgroundColor: 'gray',
        paddingVertical: '5%',
        paddingLeft:'0%',
        paddingRight:'0%',
        width: 45,
    },
    complete: {
        backgroundColor: 'pink',
        paddingVertical: '5%',
        paddingLeft:'0%',
        paddingRight:'0%',
        width: 45,
    },
    button: {

    }
});

export default MessageScreen;
