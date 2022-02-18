import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Button, Text, View, SafeAreaView, StyleSheet} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import {TouchableOpacity, Image} from "react-native";
import {AntDesign, Entypo, Fontisto, Ionicons} from '@expo/vector-icons';
import Swiper from "react-native-deck-swiper";
import {collection, doc, onSnapshot, setDoc, getDocs, where, query, serverTimestamp, getDoc} from "@firebase/firestore";
import {db} from "../firebase";
import generateId from "../lib/generateId";


const HomeScreen = () => {
    const navigation = useNavigation();
    const {user, logout} = useAuth();
    const swipeRef = useRef(null);
    const [profiles, setProfiles] = useState([]);

    useLayoutEffect(() => {
        onSnapshot(doc(db, 'user', user.uid), snapshot => {
            if (!snapshot.exists()) {
                navigation.navigate('Modal');
            }
        });
    }, []);

    useEffect(() => {
        let unsub;

        const fetchCards = async () => {

            const passes = await getDocs(collection(db, 'user', user.uid, 'passes')).then
            (snapshot => snapshot.docs.map((doc) => doc.id))

            const swipes = await getDocs(collection(db, 'user', user.uid, 'swipes')).then
            (snapshot => snapshot.docs.map((doc) => doc.id))

            const passedUserIds = passes.length > 0 ? passes : ['test'];
            const swipedUserIds = swipes.length > 0 ? swipes : ['test'];

            unsub = onSnapshot(
                query(
                    collection(db, 'user'),
                    where('id', 'not-in', [...passedUserIds, ...swipedUserIds])
                ),
                    (snapshot) => {
                    setProfiles(snapshot.docs.filter(doc => doc.id !== user.uid).map(doc => ({
                        id:doc.id,
                        ...doc.data(),
                    }))
                )
            })
        }
        fetchCards();
        return unsub;
    }, [db]);

    const swipeLeft = (cardIndex) => {
        if(!profiles[cardIndex]) return;

        const userSwiped = profiles[cardIndex];
        console.log('You swiped PASS on ${userSwiped.displayName}');

        setDoc(doc(db,'user',user.uid,'passes',userSwiped.id), userSwiped);
    };

    const swipeRight = async(cardIndex) => {
        if(!profiles[cardIndex]) return;

        const userSwiped = profiles[cardIndex];

        const loggedInProfile = await (await getDoc(doc(db, 'user', user.uid))).data();

        // Check if the user swipe on you
        getDoc(doc(db, 'user', userSwiped.id, "swipes",user.uid)).then(
            (documentSnapshot) => {
                if(documentSnapshot.exists()) {
                    // user has matched with you before you matched with them
                    // Create a MATCH

                    console.log('Hooray, You matched with ${userSwiped.displayName}');

                    setDoc(doc(db,'user',user.uid,'swipes',userSwiped.id),userSwiped);

                    //CREATE A MATCH

                    setDoc(doc(db,'matches',generateId(user.uid,userSwiped.id)), {
                        users: {
                          [user.uid]: loggedInProfile,
                          [userSwiped.id]: userSwiped,
                        },
                        usersMatched: [user.uid, userSwiped.id],
                        timeStamp: serverTimestamp(),
                    });
                    navigation.navigate('Match', {
                        loggedInProfile,
                        userSwiped,
                    })
                } else {
                    console.log('You swiped on ${userSwiped.displayName} (${userSwiped.job})');
                    setDoc(doc(db,'user',user.uid,'swipes',userSwiped.id),userSwiped);
                }
            }
        );
    };

    return (
        <SafeAreaView style={styles.area}>
            {/*  Header  */}
            <View>
                <TouchableOpacity style={styles.button} onPress={logout}>
                    <Image style={styles.image} source = {{uri: user.photoURL}}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('Modal')}>
                    <Fontisto name="tinder" size={50} color="#FF5864"/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.message} onPress={() => navigation.navigate('Chat')}>
                    <Ionicons name="chatbubbles-sharp" size={30} color="#FF5864"/>
                </TouchableOpacity>
            </View>
            {/*  End of header*/}

            {/*  Card */}
            <View style = {styles.card}>
                <Swiper ref={swipeRef}
                        containerStyle={{backgroundColor: "transparent"}}
                        cards={profiles}
                        stackSize={5}
                        cardIndex={0}
                        animateCardOpacity
                        verticalSwipe={false}
                        onSwipedLeft={(cardIndex)=>{
                            console.log('Swipe PASS')
                            swipeLeft(cardIndex)
                        }}
                        onSwipedRight={(cardIndex)=>{
                            console.log('Swipe MATCH')
                            swipeRight(cardIndex)
                        }}
                        overlayLabels={{
                            left: {
                                title: 'NOPE',
                                style: {
                                    label: {
                                        textAlign: "right",
                                        color: 'red',

                                    },
                                },
                            },
                            right: {
                                title: 'MATCH',
                                style: {
                                    label: {
                                        textAlign: "left",
                                        color: 'green',
                                    },
                                },
                            }
                        }}
                        renderCard = {(card) => card ? (
                            <View key={card.id} style = {styles.info}>
                                <Image style = {styles.photo} source={{uri:card.photoURL}}/>

                                <View style = {styles.info2}>
                                    <View>
                                        <Text style={styles.name}>{card.displayName}</Text>
                                        <Text>{card.job}</Text>
                                    </View>
                                    <Text style={styles.age}>{card.age}</Text>
                                </View>
                            </View>
                        ):(
                            <View style = {styles.info}>
                                <Text style={styles.no_profile}>No more profiles</Text>
                                <Image style = {styles.no_profile_emoji}
                                       height={100}
                                       width={100}
                                       left={145}
                                       source={require("../sad-icon.jpg")}
                                />
                            </View>
                        )}
                />
            </View>

            <View style = {styles.click_button}>
                <TouchableOpacity onPress={() => swipeRef.current.swipeLeft()}
                                  style={styles.choose_cross}>
                    <Entypo name="cross" size = {25} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => swipeRef.current.swipeRight()}
                                  style={styles.choose_heart}>
                    <AntDesign name="heart" size={25}/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        marginTop: '15%',
        marginHorizontal: '43%',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        width: 50,
        borderRadius: 20,
    },
    area: {
        flex: 1,
    },
    image: {
        height: 30,
        width: 30,
        borderRadius: 20,
    },
    button: {
        position: 'absolute',
        marginTop: '20%',
        marginLeft: '3%',
    },
    message: {
        position: 'absolute',
        marginTop: '20%',
        marginLeft: '88%',
    },
    card: {
        flex: 1,
        margin: 6,
    },
    info: {
        position: 'relative',
        backgroundColor: 'white',
        height: '75%',
        borderRadius: 15,
    },
    photo: {
        position: 'absolute',
        height:'100%',
        width: '100%',
        borderRadius: 15,
    },
    info2: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'white',
        width: '100%',
        justifyContent: "space-between",
        alignItems: 'baseline',
        flexDirection: 'row',
        height: 80,
        paddingStart: "5%",
        paddingEnd: "5%",
        paddingTop: "2%",
        borderBottomEndRadius:15,
        borderBottomStartRadius:15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
    },
    name: {
        fontWeight:'bold',
        fontSize: 17,
    },
    age: {
        fontWeight:'bold',
        fontSize: 17,
    },
    click_button: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "space-around",
    },
    choose_cross: {
        marginTop: "60%",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        width: 60,
        height: 60,
        backgroundColor: "#FFB6C1",
    },
    choose_heart: {
        marginTop: "60%",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        width: 60,
        height: 60,
        backgroundColor: "#90EE90",
    },
    no_profile: {
        fontWeight: 'bold',
        paddingBottom: '45%',
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 20,
    },
    no_profile_emoji: {
        height: 75,
        width: 75,
    },
});

export default HomeScreen;
