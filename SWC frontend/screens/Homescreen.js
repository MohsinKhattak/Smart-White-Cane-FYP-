import {
  StyleSheet,
  Pressable,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
// import { Camera, CameraType } from "expo-camera";
import {useState, useEffect, useRef} from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Header from './Header';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Documents from './Documents';
import TextRecognition from './TextRecognition';
import Tts from 'react-native-tts';
import Voice from '@react-native-voice/voice';

import {raspberry_ip} from './ipAddress';
// import * as Speech from "expo-speech";
const ip = raspberry_ip;
const IP = `http://${ip}:4000`;
// import Menu from "./Components/Menu";
const Homescreen = ({navigation}) => {
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

    switch (e.value[0].toLowerCase()) {
      case 'start': {
        startDetection();
        break;
      }
      case 'mute': {
        stopDetection();
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

  /////////////////////////////////Start detection///////////////////////////////////
  const [isDetecting, setIsDetecting] = useState(false);

  const startDetection = async () => {
    try {
      const response = await fetch(`${IP}/start_detect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (data.message === 'Detection started') {
        setIsDetecting(true);
      } else {
        setIsDetecting(false);
        console.error(data.message);
      }
    } catch (error) {
      setIsDetecting(false);
      console.error(error);
    }
  };
  useEffect(() => {
    const nav = 'Navigation';
    Tts.speak(nav);
  }, []);
  /////////////////To be implemented for stopping yolo////////////////////////////
  const stopDetection = async () => {
    try {
      const response = await fetch(`${IP}/stop_detect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (data.message === 'Detection stopped') {
        setIsDetecting(false);
      }
    } catch (error) {
      setIsDetecting(false);
      console.error(error);
    }
  };

  // Call the startDetection function when the screen is loaded

  // const navigation = useNavigation();

  function navigateToProfilePage() {
    const nav = 'User profile';
    Tts.speak(nav);
  }

  //   let cameraRef = useRef();
  //   const [type, setType] = useState(CameraType.back);
  //   const [hasCameraPermission, setHasCameraPermission] = useState();

  //   useEffect(() => {
  //     (async () => {
  //       const cameraPermission = await Camera.requestCameraPermissionsAsync();

  //       setHasCameraPermission(cameraPermission.status === "granted");
  //     })();
  //   }, []);

  //   if (hasCameraPermission === undefined) {
  //     return <Text>Requestion permissions...</Text>;
  //   } else if (!hasCameraPermission) {
  //     return <Text>Permission for camera not granted.</Text>;
  //   }
  // const Tab=createBottomTabNavigator();
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
        {/* <Camera style={styles.camera} type={type} ref={cameraRef}></Camera> */}
        <TouchableOpacity style={styles.takePic} onPress={startDetection}>
          <Text style={{color: 'white', fontSize: 20}}>Start Detection</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.takePic} onPress={stopDetection}>
          <Text style={{color: 'white', fontSize: 20}}>Stop Detection</Text>
        </TouchableOpacity>
        <Text style={{color: 'black'}}>
          {isDetecting ? 'Detection started' : 'Detection not started'}
        </Text>
      </View>
    </Pressable>
  );
};

const Tab = createBottomTabNavigator();
const Screen = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: '#29335C',
        tabBarInactiveTintColor: '#ACC4B1',
        tabBarStyle: {height: 70, backgroundColor: '#4B88A2', paddingTop: 5},
        tabBarLabelStyle: {fontSize: 16, paddingBottom: 4, fontWeight: 'bold'},
      }}>
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarLabel: 'Documents',
          tabBarIcon: ({focused}) => (
            <FontAwesome5
              name="folder-open"
              color={'black'}
              size={32}
              style={{color: focused ? `#29335C` : '#AAC0AF'}}
            />
          ),
        }}
        name="Documents"
        component={Documents}
      />

      <Tab.Screen
        options={{
          headerShown: false,
          tabBarLabel: 'Navigation',
          tabBarIcon: ({focused}) => (
            <FontAwesome
              name="camera"
              color={'black'}
              size={32}
              style={{color: focused ? `#29335C` : '#AAC0AF'}}
            />
          ),
        }}
        name="Home"
        component={Homescreen}
      />

      <Tab.Screen
        options={{
          headerShown: false,
          tabBarLabel: 'Text',
          tabBarIcon: ({focused}) => (
            <FontAwesome5
              name="file-alt"
              color={'black'}
              size={32}
              style={{color: focused ? `#29335C` : '#AAC0AF'}}
            />
          ),
        }}
        name="TextRecognition"
        component={TextRecognition}
      />
    </Tab.Navigator>
  );
};

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
    color: '#5b5f97',
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

export default Screen;
