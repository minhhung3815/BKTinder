import React, {useLayoutEffect, useState} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import useAuth from "../hooks/useAuth";
import {TextInput} from "react-native";
import {TouchableOpacity} from "react-native";
import {useNavigation} from "@react-navigation/core";
import {doc,setDoc, serverTimestamp} from "@firebase/firestore"
import {db} from "../firebase";



const ModalScreen = () => {
    const {user} = useAuth();
    const navigation = useNavigation();
    const [image, setImg] = useState(null);
    const [job, setJob] = useState(null);
    const [age, setAge] = useState(null);
    const [phone, setPhone] = useState(null);
    const [email, setEmail] = useState(null);


    const incompleteForm = !image || !job || !phone || !age;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: "Update your profile",
            headerStyle: {
                backgroundColor: "#FF5864",
            },
            headerTitleStyle: {color: 'white'},
        });
    }, []);

    const updateUserProfile = () => {
        setDoc(doc(db, 'user', user.uid), {
            id: user.uid,
            displayName: user.displayName,
            photoURL: image,
            job: job,
            age: age,
            phone: phone,
            timestamp: serverTimestamp(),
        }).then(() => {
            navigation.navigate('Home')
        }).catch((error) => {
            alert(error.message);
        });
    };
    return (
        <View style={styles.container}>
            <Image
                style={styles.imageSize}
                resizeMode="contain"
                source={{uri: "https://download.logo.wine/logo/Tinder_(app)/Tinder_(app)-Logo.wine.png"}}
            />

            <Text style={styles.welcome}>
                Welcome {user.displayName}
            </Text>

            <Text style={styles.step}>
                Step 1: The Profile Picture
            </Text>
            <TextInput value={image}
                       onChangeText={setImg}
                       style = {styles.inputPic}
                       placeholder={"Enter a Profile Picture URL"}
            />

            <Text style={styles.step}>
                Step 2: Your job
            </Text>
            <TextInput value={job}
                       onChangeText={setJob}
                       style = {styles.inputPic}
                       autoCapitalize = "sentences"
                       placeholder={"Enter your job"}
            />

            <Text style={styles.step}>
                Step 3: Your age
            </Text>
            <TextInput value={age}
                       onChangeText={setAge}
                       style = {styles.inputPic}
                       keyboardType="numeric"
                       placeholder={"Enter your age"}
            />

            <Text style={styles.step}>
                Step 4: Your phone number
            </Text>
            <TextInput value={phone}
                       onChangeText={setPhone}
                       style = {styles.inputPic}
                       keyboardType="phone-pad"
                       placeholder={"Enter your phone number"}
            />

            <Text style={styles.step}>
                Step 5: Your email address
            </Text>
            <TextInput value={email}
                       onChangeText={setEmail}
                       style = {styles.inputPic}
                       keyboardType="email-pad"
                       placeholder={"Enter your email address (optional)"}
            />

            <TouchableOpacity disabled={incompleteForm} style={styles.updatePro} onPress={updateUserProfile}>
                <Text style={[styles.updateW, incompleteForm ? styles.incomplete : styles.complete]}>
                    Update Profile
                </Text>
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: '5%',
    },
    imageSize: {
        height: '15%',
        width: '100%',
    },
    welcome: {
        color: 'grey',
        fontWeight: 'bold',
        fontSize: 20,
        fontStyle:'italic',
    },
    step: {
        paddingTop: '5%',
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold',
    },
    inputPic: {
        paddingTop: '1%',
        textAlign: 'center',
        fontSize: 16,
    },
    updatePro: {
        position:'relative',
        bottom: -30,
        textAlign: 'center',
        width: '70%',
        borderRadius: 15,
        paddingVertical: '5%',
        paddingLeft:'5%',
        paddingRight:'5%',
    },
    updateW: {
        textAlign: 'center',
        fontSize: 17,
        color: 'white',
    },
    incomplete: {
        backgroundColor: 'grey',
        borderRadius: 15,
        paddingVertical: '5%',
        paddingLeft:'5%',
        paddingRight:'5%',
    },
    complete: {
        backgroundColor: '#F08080',
        borderRadius: 15,
        paddingVertical: '5%',
        paddingLeft:'5%',
        paddingRight:'5%'
    },
})
export default ModalScreen;
