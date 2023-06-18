import {useState, useEffect} from 'react';
import {StatusBar} from 'expo-status-bar';
import {
  StyleSheet,
  Pressable,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
  TextInput,
  LinearGradient,
  Keyboard,
} from 'react-native';
import Modal from 'react-native-modal';
import {useNavigation} from '@react-navigation/native';
import Tts from 'react-native-tts';
import Voice from '@react-native-voice/voice';
import {raspberry_ip} from './ipAddress';
const ip = raspberry_ip;
// import * as Speech from "expo-speech";
const IP = `http://${ip}:4000`;
const Register = () => {
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
  const [otp, setOtp] = useState(null);
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
      case 'sign up': {
        Sendtobackend();
        break;
      }
      case 'back': {
        navigation.navigate('Frontpage');
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

  const navigation = useNavigation();
  function navigateToOTPPage() {
    const navigation = 'OTP screen';
    Tts.speak(navigation);
  }

  const [fdata, setFdata] = useState({
    name: '',
    phone: '',
    age: '',
    password: '',
    cpassword: '',
  });

  const [errormsg, setErrormsg] = useState(null);

  const firstNameRegex = /^[A-Za-z]+$/;
  const phoneNumberRegex = /^\+\d{2}\s\d{3}\s\d{7}$/;
  const passwordRegex = /^(?=.[a-z])(?=.[A-Z])(?=.*\d).+$/;

  const Sendtobackend = () => {
    console.log(fdata);
    if (
      fdata.name == '' ||
      fdata.phone == '' ||
      fdata.password == '' ||
      fdata.cpassword == '' ||
      fdata.age == ''
    ) {
      setErrormsg('All fields are required');
      return;
    } else if (!firstNameRegex.test(fdata.name)) {
      setErrormsg('Name must consist of letters only');
      return;
    } else if (!phoneNumberRegex.test(fdata.phone)) {
      setErrormsg('Phone no should be written as +92 318 5986446');
      return;
    }
    // else if (!passwordRegex.test(fdata.password)) {
    //   setErrormsg(
    //     'Password should have one lowercase, one uppercase, one digit.',
    //   );
    //   return;
    // }
    else if (fdata.password != fdata.cpassword) {
      setErrormsg('Password and Confirm Password must be same');
      return;
    } else {
      fetch(`${IP}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fdata),
      })
        .then(response => response.json())
        .then(data => {
          if (data.msg === 'OTP sent successfully') {
            const otp = data.otp;
            console.log(data);
            setOtp(otp);
            navigation.navigate('OTP', {fdata: fdata, otp: otp});
          } else {
            setErrormsg('Error sending OTP');
          }
        })
        .catch(error => {
          console.error(error);
          setErrormsg('Error sending OTP here');
        });
    }
  };

  return (
    <Pressable style={styles.container} onLongPress={_startRecognizing}>
      <View style={{marginTop: 40}}>
        <Text style={styles.heading}>Smart White</Text>
        <Text style={styles.heading}>Cane</Text>
      </View>

      <View>
        <Image
          source={require('../assets/blind.png')}
          size={20}
          style={{width: 150, height: 150}}
        />
      </View>

      <View style={styles.box}>
        <TextInput
          style={styles.input}
          value={fdata.name}
          onPressIn={() => setErrormsg(null)}
          onChangeText={text => setFdata({...fdata, name: text})}
          placeholder="First name"
          maxLength={50}
          placeholderTextColor="grey"
        />

        <TextInput
          style={styles.input}
          onPressIn={() => setErrormsg(null)}
          onChangeText={text => setFdata({...fdata, age: text})}
          keyboardType="numeric"
          placeholder="Age"
          value={fdata.age}
          maxLength={2}
          placeholderTextColor="grey"
        />

        <TextInput
          style={styles.input}
          onPressIn={() => setErrormsg(null)}
          onChangeText={text => setFdata({...fdata, phone: text})}
          placeholder="Phone number"
          value={fdata.phone}
          placeholderTextColor="grey"
        />

        <TextInput
          style={styles.input}
          onPressIn={() => setErrormsg(null)}
          onChangeText={text => setFdata({...fdata, password: text})}
          secureTextEntry={true}
          placeholder="Password"
          value={fdata.password}
          placeholderTextColor="grey"
        />

        <TextInput
          style={styles.input}
          onPressIn={() => setErrormsg(null)}
          onChangeText={text => setFdata({...fdata, cpassword: text})}
          placeholder="Confirm Password"
          secureTextEntry={true}
          value={fdata.cpassword}
          placeholderTextColor="grey"
        />
        {errormsg ? <Text style={styles.errormessage}>{errormsg}</Text> : null}
        <View>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              backgroundColor: `#5b5f97`,
              padding: 12,
              borderRadius: 15,
              width: 205,
              marginLeft: 60,
              marginTop: 12,
            }}
            onPress={() => {
              Sendtobackend();
            }}>
            <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffce8',
    alignItems: 'center',
    //justifyContent: 'center',
  },
  heading: {
    color: '#4B88A2',
    fontSize: 45,
    alignSelf: 'center',
    fontFamily: 'serif',
    fontStyle: 'italic',
  },
  box: {
    border: 2,
    borderColor: '#5b5f97',
    borderWidth: 2,
    height: 355,
    width: 330,
    margin: 10,
    backgroundColor: '#92AFD7',
    borderRadius: 15,
    paddingTop: 10,
  },
  input: {
    height: 40,
    marginTop: 10,
    marginRight: 12,
    marginLeft: 12,
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#5b5f97',
    padding: 10,
    color: 'black',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: Platform.OS === 'ios' ? 3 : 5,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  modalstyle: {
    flex: 1,
    backgroundColor: 'white',
    // width:'100%',
    height: 400,
    margin: 10,
    marginTop: 100,
    marginBottom: 100,
    padding: 16,
    justifyContent: 'center',
    alignContent: 'center',
    borderColor: `#20b2aa`,
    borderWidth: 4,
    borderRadius: 10,
  },
  errormessage: {
    color: 'red',
    marginLeft: 12,
  },
});

export default Register;
