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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Tts from 'react-native-tts';
import {ip} from './ipAddress';

// import * as Speech from "expo-speech";
const IP = `http://${ip}:4000`;
const AdminLogin = () => {
  const navigation = useNavigation();
  //   function navigateToAdminLoginPage() {
  //     const navigation = "Admin Login";
  //     Speech.speak(navigation);
  //   }
  const [fdata, setFdata] = useState({
    username: '',
    password: '',
  });

  function navigationToAdminHome() {
    const nav = 'Admin Login';
    Tts.speak(nav);
  }

  const [errormsg, setErrormsg] = useState(null);
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const passwordRegex = /^(?=.[a-z])(?=.[A-Z])(?=.*\d).+$/;

  const Sendtobackend = () => {
    // console.log(fdata);
    if (fdata.email == '' || fdata.password == '') {
      setErrormsg('All fields are required');
      return;
    }
    // else if (!emailRegex.test(fdata.email)) {
    //   setErrormsg('Email should be like example@example.com');
    //   return;
    // } else if (!passwordRegex.test(fdata.password)) {
    //   setErrormsg(
    //     'Password should have one lowercase, one uppercase, one digit.',
    //   );
    //   return;
    // }
    else {
      fetch(`${IP}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fdata),
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          // Handle the response from the API
          if (data.msg === 'Login successful') {
            console.log(data);
            // If the API returns a token, save it in local storage and navigate to the home screen
            AsyncStorage.setItem('token', data.access_token)
              .then(() => {
                console.log('Token saved successfully!');
                console.log(data.access_token);
                // Save the user ID in async storage
                AsyncStorage.setItem('user_id', data.user_id)
                  .then(() => {
                    console.log('User ID saved successfully!');
                    navigationToAdminHome();
                    navigation.navigate('AdminHome');
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
      <View style={{marginTop: 50, marginBottom: 40}}>
        <Text style={styles.heading}>Admin Login</Text>
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
          onChangeText={text => setFdata({...fdata, username: text})}
          keyboardType="email-address"
          placeholder="Email Address"
          value={fdata.username}
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
        <Text style={{fontSize: 16, color: 'black'}}>You are the user? </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Login');
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
    height: 40,
    marginTop: 15,
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

export default AdminLogin;
