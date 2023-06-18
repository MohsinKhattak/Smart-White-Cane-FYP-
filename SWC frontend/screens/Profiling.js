import {
  StyleSheet,
  Pressable,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import {useState, useEffect, useRef} from 'react';
import Modal from 'react-native-modal';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Tts from 'react-native-tts';
import Voice from '@react-native-voice/voice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {ip} from './ipAddress';

// import * as Speech from "expo-speech";
const IP = `http://${ip}:4000`;
const Profiling = () => {
  ////////////////////////////speech/////////////////////////////////////////////

  useEffect(() => {
    //Setting callbacks for the process status
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;

    // return () => {
    //   Voice.destroy().then(Voice.removeAllListeners);
    // };
  }, []);

  const [recognized, setRecognized] = useState('');
  const [pitch, setPitch] = useState('');
  const [error, setError] = useState('');
  const [end, setEnd] = useState('');
  const [started, setStarted] = useState(false);
  const [results, setResults] = useState([]);
  const [partialResults, setPartialResults] = useState([]);
  const [display, setDisplay] = useState('');
  const [userData, setUserData] = useState({});
  const [fdata, setFdata] = useState({
    name: '',
    phone: '',
    age: '',
  });
  const [id, setID] = useState('');
  const [token, setToken] = useState(null);
  onSpeechStart = e => {
    console.log('onSpeechStart: ', e);
    setStarted(true);
  };

  onSpeechEnd = e => {
    console.log('onSpeechEnd: ', e);

    setEnd('√');
    setStarted(false);
  };

  const onSpeechError = e => {
    console.log('onSpeechError: ', e);
    setError(JSON.stringify(e.error));
  };

  const onSpeechPartialResults = e => {
    setPartialResults(e.value);
  };

  onSpeechResults = e => {
    console.log('onSpeechResults: ', e);

    setResults(e.value[0].toLowerCase());
    console.log('results', e.value[0].toLowerCase());

    //Navigating acc to speech

    switch (e.value[0]) {
      case 'edit': {
        handleModal();
        break;
      }
      case 'documents': {
        // alert("navigating to Login page")

        navigation.navigate('Documents');
        break;
      }
      default: {
        Tts.speak('Kindly repeat yourself');
        alert('Kindly repeat yourself');
      }
    }
  };
  _startRecognizing = async () => {
    try {
      await Voice.start('en-US');
      setRecognized('');
      setPitch('');
      setError('');
      setStarted(false);
      setResults([]);
      setPartialResults([]);
      setEnd('');
      console.log('start recognized');
    } catch (e) {
      console.error('start error', e);
    }
  };

  ////////////////////////////////Getting Data from Servre///////////////////////////////////////
  useEffect(() => {
    const getToken = async () => {
      try {
        const value = await AsyncStorage.getItem('token');
        if (value !== null) {
          setToken(value);
        }
      } catch (e) {
        console.log('Error retrieving token from async storage:', e);
      }
    };
    getToken();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        console.log('sending data');
        try {
          const response = await axios.get(`${IP}/users/UserInfo`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log('Requess sent');
          setUserData(response.data);
          setFdata(response.data);
          setID(response.data._id);
          console.log(response.data);
        } catch (e) {
          console.log('Error fetching user data:', e);
        }
      }
    };
    fetchUserData();
  }, [token]);
  /////////////////////////////updating data in server//////////////////////
  const reloadData = async () => {
    if (token) {
      console.log('sending data');
      try {
        const response = await axios.get(`${IP}/users/UserInfo`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Requess sent');
        setUserData(response.data);
        setFdata(response.data);
        setID(response.data._id);
        console.log(response.data);
      } catch (e) {
        console.log('Error fetching user data:', e);
      }
    }
  };
  const submit = () => {
    // Make API call to update user data
    axios
      .patch(`${IP}/users/${userData._id}`, fdata)
      .then(response => {
        if (response.data.msg === 'User updated successfully') {
          // Close modal
          // alert('Information Updated!');
          Tts.speak('Information updated');
          reloadData();
          handleModal();
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  ////////////////////////////////////Speech//////////////////////////////////////////////////////

  const navigation = useNavigation();

  function navigateToDocumentsPage() {
    const navigation = 'Documents Handling';
    Speech.speak(navigation);
  }
  // function navigateToNavigationPage() {
  //   const navigation = "User Navigation";
  //   Speech.speak(navigation);
  // }
  // function navigateToTextRecognitionPage() {
  //   const navigation = "Text Recognition";
  //   Speech.speak(navigation);
  // }

  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const handleModal = () => setIsModalVisible(() => !isModalVisible);

  return (
    <Pressable style={styles.container} onLongPress={_startRecognizing}>
      <TouchableOpacity
        style={styles.topHeader}
        onPress={() => navigation.navigate('Homescreen')}>
        <FontAwesome5 name="arrow-circle-left" size={43} />
      </TouchableOpacity>

      <View style={styles.innerContainer}>
        <View style={styles.imageview}>
          <Image
            source={require('../assets/profileIcon.png')}
            style={{width: 150, height: 150}}
          />
        </View>

        <View>
          <Text style={styles.label}>Name: </Text>
          <Text style={styles.info}>{userData.name}</Text>
          <Text style={styles.label}>Age:</Text>
          <Text style={styles.info}>{userData.age} years old</Text>
          <Text style={styles.label}>Phone number:</Text>
          <Text style={styles.info}>{userData.phone}</Text>
          <View>
            <TouchableOpacity
              style={{
                alignSelf: 'center',
                alignItems: 'center',
                backgroundColor: `#5b5f97`,
                padding: 12,
                borderRadius: 20,
                width: 200,
                marginLeft: 10,
                marginTop: 40,
              }}
              onPress={handleModal}>
              <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
                Edit
              </Text>
            </TouchableOpacity>

            <Modal isVisible={isModalVisible}>
              <View style={styles.modalstyle}>
                <Text style={styles.modalText}>
                  Update your information here
                </Text>
                <TextInput
                  style={styles.input}
                  onChangeText={text => setFdata({...userData, name: text})}
                  value={fdata.name}
                  placeholder="Name"
                  maxLength={50}
                />

                <TextInput
                  style={styles.input}
                  onChangeText={text => setFdata({...userData, age: text})}
                  value={fdata.age}
                  placeholder="Age"
                  maxLength={2}
                />

                <TextInput
                  style={styles.input}
                  onChangeText={text => setFdata({...userData, phone: text})}
                  value={fdata.phone}
                  placeholder="Phone"
                  maxLength={50}
                />

                <View>
                  <TouchableOpacity
                    style={{
                      alignItems: 'center',
                      backgroundColor: `#5b5f97`,
                      padding: 10,
                      width: 180,
                      borderRadius: 15,
                      marginLeft: 50,
                      marginTop: 30,
                    }}
                    onPress={submit}>
                    <Text style={{color: 'white', fontSize: 16}}>Update</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    //height: "100%",
    backgroundColor: '#4B88A2',
    flexDirection: 'column',
  },
  innerContainer: {
    flexDirection: 'column',
    height: '90%',
    // paddingTop: 10,
    //  alignItems: "center",
    // justifyContent:'center',
    backgroundColor: '#fffce8',
    width: '100%',
    borderRadius: 5,
  },
  topHeader: {
    height: '10%',
    width: '100%',
    justifyContent: 'flex-start',
    padding: 9,
  },
  imageview: {
    alignItems: 'center',
    backgroundColor: 'white',
    backgroundColor: '#4B88A2',
    marginBottom: 10,
    paddingBottom: 20,
  },
  input: {
    height: 45,
    marginTop: 15,
    marginRight: 10,
    marginLeft: 10,
    borderWidth: 2,
    borderColor: '#4B88A2',
    padding: 7,
    backgroundColor: 'white',
    color: 'black',
  },
  // buttonContainer: {
  //   justifyContent: "center",
  // },
  info: {
    fontSize: 18,
    fontFamily: 'serif',
    margin: 10,
    borderWidth: 2,
    borderColor: '#5b5f97',
    padding: 10,
    paddingLeft: 8,
    backgroundColor: 'white',
    borderRadius: 5,
    color: 'black',
  },

  label: {
    fontSize: 20,
    fontFamily: 'serif',
    margin: 5,
    marginLeft: 12,
    fontWeight: 'bold',
    color: '#5b5f97',
  },

  modalstyle: {
    // flex:1,
    backgroundColor: '#fffce8',
    // width:'100%',
    //  height:700,
    margin: 10,
    marginTop: 60,
    marginBottom: 75,
    padding: 16,
    alignContent: 'center',
    borderColor: `#5b5f97`,
    borderWidth: 4,
    borderRadius: 10,
    paddingTop: 40,
  },
  modalText: {
    fontSize: 18,
    marginLeft: 12,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#5b5f97',
  },
});

export default Profiling;
