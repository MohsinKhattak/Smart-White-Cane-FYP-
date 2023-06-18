import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';
import {useState, useEffect, useRef} from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import Tts from 'react-native-tts';
import Voice from '@react-native-voice/voice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ip} from './ipAddress';

// import * as Speech from "expo-speech";
const IP = `http://${ip}:4000`;
const Documents = () => {
  ////////////////////////////Get documents from backend//////////////////

  const [images, setImages] = useState([]);

  useEffect(() => {
    // get the user id from async storage
    AsyncStorage.getItem('user_id')
      .then(userId => {
        // make a GET request to fetch the user's images
        fetch(`${IP}/images/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => response.json())
          .then(data => {
            // set the images in state
            setImages(data);
            // console.log(data);
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        console.error(error);
      });
  }, []);
  ////////////////////////////speech/////////////////////////////////////////////

  useEffect(() => {
    const navigation = 'Saved documents';
    Tts.speak(navigation);
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

    switch (e.value[0].toLowerCase()) {
      case 'profile': {
        navigateToProfilePage();
        navigation.navigate('Profiling');
        break;
      }
      case 'back': {
        // alert("navigating to Login page")
        //navigateToLoginPage()
        navigation.navigate('Homescreen');
        break;
      }

      default: {
        Tts.speak('Kindly repeat yourself');
        alert('Kindly repeat yourself');
      }
    }

    // if(e.value[0]=="Go back"){
    //   navigation.navigate("Frontpage")
    // }
    // else if(e.value[0]=="sign up"){
    //   Sendtobackend()
    // }
    // else if(e.value[0]=="Register"){
    //   navigateToRegisterPage()
    //     navigation.navigate("Register")
    // }
    // else if(e.value[0]=="login"){
    //   navigateToLoginPage()
    //     navigation.navigate("Login")
    // }
    // else{
    //   console.log("here2",e.value[0])
    //   Tts.speak("Kindly repeat yourself")
    // }
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

  ////////////////////////////////////Speech//////////////////////////////////////////////////////

  const navigation = useNavigation();

  function navigateToProfilePage() {
    const navigation = 'User Profile';
    Tts.speak(navigation);
  }
  const openImage = key => {
    // Send a GET request to the backend route with the image ID
    fetch(`${IP}/ocr/${key}`, {
      method: 'GET',
    })
      .then(response => {
        // Check if the response was successful
        if (response.ok) {
          // Text is being read aloud
          console.log('Text is being read aloud');
        } else if (response.status === 404) {
          // Image not found
          console.log('Image not found');
        } else {
          // Handle other errors
          console.log('An error occurred');
        }
      })
      .catch(error => {
        // Handle network errors
        console.log('Network error occurred');
      });
  };
  const deleteImage = image_id => {
    console.log('image_id:', image_id);
    // Send a DELETE request to the backend route with the image ID
    fetch(`${IP}/images/${image_id}`, {
      method: 'DELETE',
    })
      .then(response => {
        // Check if the response was successful
        if (response.ok) {
          // Image deleted successfully
          console.log('Image deleted successfully');
          reloadData();
        } else if (response.status === 404) {
          // Image not found
          console.log('Image not found');
        } else {
          // Handle other errors
          console.log('An error occurred');
        }
      })
      .catch(error => {
        // Handle network errors
        console.log('Network error occurred');
      });
  };

  function reloadData() {
    AsyncStorage.getItem('user_id')
      .then(userId => {
        // make a GET request to fetch the user's images
        fetch(`${IP}/images/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => response.json())
          .then(data => {
            // set the images in state
            setImages(data);
            // console.log(data);
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        console.error(error);
      });
  }
  return (
    <Pressable style={styles.container} onLongPress={_startRecognizing}>
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Profiling');
            navigateToProfilePage();
          }}>
          <FontAwesome5 name="user-circle" size={50} />
        </TouchableOpacity>
      </View>

      <View style={styles.innerContainer}>
        <Text style={styles.heading}>Documents</Text>

        <View>
          {images.length === 0 ? (
            <Text>No documents saved</Text>
          ) : (
            <ScrollView style={{width: '100%', marginTop: 20}}>
              {images.map(image => (
                <TouchableOpacity
                  key={image.image_id}
                  style={styles.box}
                  onPress={() => {
                    openImage(image.image_id);
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={{uri: image.image_url}}
                      style={styles.image}
                    />
                    <Text style={styles.imageName}>{image.image_name}</Text>
                  </View>
                  <TouchableOpacity
                    style={{marginLeft: 60}}
                    onPress={() => {
                      deleteImage(image.image_id);
                    }}>
                    <AntDesign name="delete" size={30} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* <ScrollView style={{width: '100%', marginTop: 20}}>
          {images.map(image => (
            <TouchableOpacity
              key={image.image_id}
              style={styles.box}
              onPress={() => {
                openImage(image.image_id);
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image source={{uri: image.image_url}} style={styles.image} />
                <Text style={styles.imageName}>{image.image_name}</Text>
              </View>
              <TouchableOpacity
                style={{marginLeft: 10}}
                onPress={() => {
                  deleteImage(image.image_id);
                }}>
                <AntDesign name="delete" size={30} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView> */}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#4B88A2',
    flexDirection: 'column',
  },
  imageName: {
    fontSize: 16,
    fontWeight: 'bold',
    // marginTop: 20,
    marginLeft: 8,
    color: 'white',
  },
  image: {
    width: 60,
    height: 60,
    marginVertical: 5,
    marginLeft: 5,
  },
  innerContainer: {
    // flexDirection:'row',
    height: '90%',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fffce8',
    paddingTop: 20,
    width: '100%',
    borderRadius: 5,
  },
  topHeader: {
    flexDirection: 'row',
    height: '10%',
    width: '100%',
    justifyContent: 'space-between',
    padding: 1,
    marginBottom: 3,
    marginTop: 9,
    paddingRight: 7,
    paddingLeft: 7,
  },

  heading: {
    color: `#3A487D`,
    fontSize: 50,
    // alignSelf:'center',
    fontFamily: 'serif',
    fontStyle: 'italic',
  },
  box: {
    flexDirection: 'row',
    width: '95%',
    alignSelf: 'center',
    backgroundColor: '#5790A9',
    margin: 10,
    padding: 7,
    borderRadius: 15,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  ttext: {
    fontSize: 16,
    margin: 5,
    color: 'white',
  },
});

export default Documents;
