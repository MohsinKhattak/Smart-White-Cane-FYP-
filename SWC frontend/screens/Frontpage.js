import {StatusBar} from 'expo-status-bar';
import {
  StyleSheet,
  Pressable,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
} from 'react-native';
import {useState, useEffect} from 'react';
import React from 'react';
import Tts from 'react-native-tts';
import Voice from '@react-native-voice/voice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ip} from './ipAddress';
const IP = `http://${ip}:4000`;

const Frontpage = ({navigation}) => {
  useEffect(() => {
    Tts.speak(
      'Welcome to Your Smart White Cane Application. Long press the screen to give voice command',
    );
    //Setting callbacks for the process status
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
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
      case 'register': {
        navigateToRegisterPage();
        navigation.navigate('Register');
        break;
      }
      case 'start detection': {
        Tts.speak('detection started');
        startDetection();
        break;
      }
      case 'start': {
        Tts.speak('detection started');
        startDetection();
        break;
      }
      case 'stop': {
        Tts.speak('detection stopped');
        stopDetection();
        break;
      }
      case 'stop detection': {
        Tts.speak('detection stopped');
        stopDetection();
        break;
      }
      case 'capture': {
        Tts.speak('image captured');
        captureImage();
        break;
      }
      case 'capture image': {
        Tts.speak('image captured');
        captureImage();
        break;
      }
      case 'login': {
        navigateToLoginPage();
        navigation.navigate('Login');
        break;
      }
      case 'documents': {
        // navigateToDocumentsPage();
        console.log('going to documents');
        navigation.navigate('Documents');
        break;
      }
      case 'profile': {
        console.log('going to profile');
        Tts.speak('Profile page');
        navigation.navigate('Profiling');
        break;
      }
      case 'text': {
        console.log('going to text recognition');
        Tts.speak('Text Recognition');
        navigation.navigate('TextRecognition');
        break;
      }
      case 'text recognition': {
        console.log('going to text recognition');
        Tts.speak('Text Recognition');
        navigation.navigate('TextRecognition');
        break;
      }
      case 'navigation': {
        console.log('going to navigation home');
        Tts.speak('Navigation screen');
        navigation.goBack();
        break;
      }
      case 'home': {
        console.log('going to navigation home');
        Tts.speak('Navigation screen');
        navigation.goBack();
        break;
      }
      default: {
        Tts.speak('Kindly repeat yourself');
        alert('Kindly repeat yourself');
      }
    }
  };

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

  //Text to speech for navigating
  function navigateToRegisterPage() {
    const nav = 'Register Page';
    Tts.speak(nav);
  }
  function navigateToLoginPage() {
    const nav = 'Login Page';
    Tts.speak(nav);
  }
  function navigateToDocumentsPage() {
    const nav = 'Saved documents';
    Tts.speak(nav);
  }
  return (
    <Pressable style={styles.container} onLongPress={_startRecognizing}>
      <View>
        <Image
          source={require('../assets/blind.png')}
          style={{width: 200, height: 200}}
        />
      </View>
      <View style={{marginTop: 20}}>
        <Text style={styles.heading}>Smart White</Text>
        <Text style={styles.heading}>Cane</Text>
      </View>

      <Text style={styles.desc}>Providing vision to the Blind...</Text>

      <View style={{flexDirection: 'column'}}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('Register');
            navigateToRegisterPage();
          }}>
          <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
            Get Started
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button2}
          onPress={() => {
            navigation.navigate('Login');
            navigateToLoginPage();
          }}>
          <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffce8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  heading: {
    color: '#4B88A2',
    fontSize: 50,
    alignSelf: 'center',
    fontFamily: 'serif',
    fontStyle: 'italic',
    fontWeight: 'bold',
  },

  button: {
    alignItems: 'center',
    backgroundColor: `#29335C`,
    padding: 12,
    borderRadius: 15,
    width: 350,
    marginTop: 40,
  },
  button2: {
    alignItems: 'center',
    backgroundColor: `#5b5f97`,
    padding: 12,
    borderRadius: 15,
    width: 350,
    marginTop: 20,
  },
  desc: {
    color: '#4B88A2',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
});

export default Frontpage;
