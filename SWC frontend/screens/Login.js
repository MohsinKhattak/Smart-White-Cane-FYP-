import {useState} from 'react';
import {StatusBar} from 'expo-status-bar';
import {
  StyleSheet,
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ip} from './ipAddress';

// import * as Speech from "expo-speech";
const IP = `http://${ip}:4000`;
const Login = ({navigation}) => {
  // const navigation = useNavigation();
  function navigateToAdminLoginPage() {
    const nav = 'Admin Login';
    Tts.speak(nav);
  }
  function navigateToHomePage() {
    const nav = 'Home Page';
    Tts.speak(nav);
  }
  const [fdata, setFdata] = useState({
    phone: '',
    password: '',
  });

  const [errormsg, setErrormsg] = useState(null);
  const phoneNumberRegex = /^\+\d{2}\s\d{3}\s\d{7}$/;
  const passwordRegex = /^(?=.[a-z])(?=.[A-Z])(?=.*\d).+$/;

  const Sendtobackend = () => {
    // console.log(fdata);
    if (fdata.email == '' || fdata.password == '') {
      setErrormsg('All fields are required');
      return;
    } else if (!phoneNumberRegex.test(fdata.phone)) {
      setErrormsg('Phone no should be written as +92 318 5986446');
      return;
    }
    // else if (!(passwordRegex.test(fdata.password))){
    //   setErrormsg('Password should have one lowercase, one uppercase, one digit.');
    //   return;
    // }
    else {
      fetch(`${IP}/users/Login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fdata),
      })
        .then(response => response.json())
        .then(data => {
          // Handle the response from the API
          if (data.msg === 'Login successful') {
            // If the API returns a token, save it in local storage and navigate to the home screen
            AsyncStorage.setItem('token', data.access_token)
              .then(() => {
                console.log('Token saved successfully!');
                console.log(data.access_token);
                // Save the user ID in async storage
                AsyncStorage.setItem('user_id', data.user_id)
                  .then(() => {
                    console.log('User ID saved successfully!');
                    navigateToHomePage();
                    navigation.navigate('Homescreen');
                  })
                  .catch(error => {
                    console.error('Error saving user ID:', error);
                  });
              })
              .catch(error => {
                console.error('Error saving token:', error);
              });
          } else {
            // If the API does not return a token, the user is not authenticated
            console.log('Authentication failed!');
            console.log('Error message:', data.msg);
          }
        })
        .catch(error => {
          // Handle any errors that occur during the request
          console.error('Error:', error);
        });
    }
  };

  return (
    <View style={styles.container}>
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
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{flexDirection: 'row', marginTop: 20}}>
        <Text style={{fontSize: 16, color: 'black'}}>You are the admin? </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AdminLogin');
            navigateToAdminLoginPage();
          }}>
          <Text
            style={{
              textDecorationLine: 'underline',
              fontSize: 17,
              color: '#483d8b',
              fontWeight: 'bold',
            }}>
            {' '}
            Login{' '}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
    height: 220,
    width: 330,
    margin: 10,
    marginTop: 40,
    backgroundColor: '#92AFD7',
    borderRadius: 15,
    paddingTop: 7,
    justifyContent: 'center',
  },
  input: {
    color: 'black',
    height: 40,
    marginTop: 15,
    marginRight: 12,
    marginLeft: 12,
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#5b5f97',
    padding: 10,
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

export default Login;
