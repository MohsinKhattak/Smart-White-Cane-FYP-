import {
  StyleSheet,
  Pressable,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {Camera, CameraType} from 'expo-camera';
import {useState, useEffect, useRef} from 'react';
import Header from './Header';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Tts from 'react-native-tts';
import Voice from '@react-native-voice/voice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ip} from './ipAddress';

// import * as Speech from "expo-speech";
const IP = `http://${ip}:4000`;
export default function TextRecognition({navigation}) {
  ////////////////////////////speech/////////////////////////////////////////////

  const [cameraSwitch, setCameraSwitch] = useState('OFF');

  useEffect(() => {
    const openCamera = async () => {
      try {
        const response = await fetch(`${IP}/camera/open`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          console.log('Camera is open');
          setCameraSwitch('ON');
        } else {
          console.log('Failed to open camera');
        }
      } catch (error) {
        console.error('Failed to open camera:', error);
      }
    };
    openCamera();
  }, []);

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

    switch (e.value[0]) {
      case 'capture': {
        captureImage();
        break;
      }
      case 'documents': {
        // alert("navigating to Login page")
        navigateToDocumentsPage();
        navigation.navigate('Documents');
        break;
      }
      case 'text': {
        // alert("navigating to Login page")
        navigateTotextRecogPage();
        navigation.navigate('TextRecognition');
        break;
      }
      default: {
        Tts.speak('Kindly repeat yourself profile');
        alert('Kindly repeat yourself');
      }
    }
  };
  //Navigating acc to speech

  const captureImage = () => {
    console.log('Here');
    AsyncStorage.getItem('user_id')
      .then(userId => {
        // make a GET request to fetch the user's images
        fetch(`${IP}/camera/capture/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => response.json())
          .then(data => {
            // set the images in state
            if (data.msg === 'Image saved to MongoDB') {
              console.log(data.msg);
              setCameraSwitch('OFF');
            }
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        console.error(error);
      });
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

  ///////////////////////////////////////////////////////////////////////

  // text to speech
  function navigateToDocumentsPage() {
    const navigation = 'Documents Handling';
    Tts.speak(navigation);
  }
  function navigateTotextRecogPage() {
    const navigation = 'Text Recognition';
    Tts.speak(navigation);
  }

  return (
    <Pressable style={styles.container} onLongPress={_startRecognizing}>
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Profiling');
          }}>
          <FontAwesome5 name="user-circle" size={50} />
        </TouchableOpacity>
      </View>

      <View style={styles.innerContainer}>
        <TouchableOpacity style={styles.takePic} onPress={captureImage}>
          <Text style={{color: 'white', fontSize: 20}}>Capture Image</Text>
        </TouchableOpacity>
        {cameraSwitch === 'ON' ? (
          <Text style={{color: 'black', fontSize: 16}}>
            Camera is on. Please say "capture" to take a picture.
          </Text>
        ) : (
          <Text style={{color: 'red', fontSize: 16}}>Camera is off.</Text>
        )}

        {/* <Camera style={styles.camera} type={type} ref={cameraRef}></Camera> */}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 2,
    height: '100%',
    backgroundColor: '#4B88A2',
    flexDirection: 'column',
  },
  innerContainer: {
    height: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fffce8',
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
  camera: {
    width: '100%',
    height: '100%',
    backgroundColor: 'grey',
  },
  buttonContainer: {
    justifyContent: 'center',
    bottom: 0,
  },
  takePic: {
    backgroundColor: `#29335C`,
    padding: 10,
    borderRadius: 20,
    width: 200,
    height: 45,
    alignItems: 'center',
    margin: 10,
  },
});
