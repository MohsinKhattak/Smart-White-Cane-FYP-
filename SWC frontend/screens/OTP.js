import React, {useState, useEffect} from 'react';
import {StatusBar} from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableHighlight,
  TouchableHighlightComponent,
  Pressable,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Tts from 'react-native-tts';
import {ip} from './ipAddress';

// import * as Speech from "expo-speech";
const IP = `http://${ip}:4000`;
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

const CELL_COUNT = 4;

const OTP = ({navigation, route}) => {
  useEffect(() => {
    const navigation = 'A four digit OTP has been sent to your phone number';
    Tts.speak(navigation);
  }, []);

  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const otp = route.params.otp;
  const fdata = route.params.fdata;

  console.log(otp);
  // const navigation = useNavigation();
  function navigateToHomePage() {
    const nav = 'Home Page';
    Tts.speak(nav);
  }
  const submit = () => {
    if (value.length === 4) {
      if (value === otp) {
        const data = {otp: value, ...fdata};
        // compare the entered OTP value with the OTP received from backend
        // OTP is correct, proceed with verification
        fetch(`${IP}/users/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
          .then(response => response.json())
          .then(data => {
            if (data.msg === 'User created') {
              console.log('User registered');
              navigation.navigate('Homescreen');
            } else if (data.msg === 'Invalid request, must be a JSON object') {
              console.log('Invalid request, must be a JSON object');
            }
          })
          .catch(error => {
            console.error(error);
            console.log('Error sending OTP');
          });
      } else {
        // Entered OTP is incorrect, set the state variable otpCheck to false
        setOtpCheck(false);
        console.log('OTP is not Correct');
      }
    }
  };

  return (
    <Pressable style={styles.container} onPress={Keyboard.dismiss}>
      {/* OTP heading */}
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Verify it's you!</Text>
      </View>

      <Text style={styles.description}>
        A four digit OTP has been sent to your phone number
      </Text>
      <Text style={styles.description}>OTP : {otp}</Text>
      {/* OTP cells */}
      <View style={{alignItems: 'center'}}>
        <View style={{width: 300}}>
          <CodeField
            ref={ref}
            {...props}
            // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({index, symbol, isFocused}) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
        </View>
      </View>

      {/* Submit Button */}
      <View style={{alignItems: 'center', paddingTop: 30}}>
        <TouchableOpacity style={styles.button} onPress={submit}>
          <Text style={{fontSize: 19, color: 'white', fontWeight: 'bold'}}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>

      {/* Resend OTP */}
      <View style={{flexDirection: 'column'}}>
        <View style={{alignItems: 'center'}}>
          <View style={{flexDirection: 'row', margin: 30}}>
            <TouchableOpacity

            // onPress={somefunction}
            >
              <Text
                style={{fontSize: 20, fontWeight: 'bold', color: '#4B88A2'}}>
                Resend OTP
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* </View> */}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffce8',
    // alignItems: 'center',
    paddingTop: 10,
  },

  headingContainer: {
    margin: 20,
  },

  heading: {
    color: '#4B88A2',
    fontWeight: 'bold',
    fontSize: 40,
    fontFamily: 'serif',
  },

  description: {
    color: '#4B88A2',
    fontSize: 20,
    padding: 10,
    paddingTop: 1,
    alignSelf: 'center',
    fontWeight: 'bold',
  },

  codeFieldRoot: {marginTop: 20},

  cell: {
    width: 50,
    height: 50,
    lineHeight: 48,
    margin: 1,
    fontSize: 24,
    borderColor: '#5b5f97',
    borderWidth: 2,
    backgroundColor: 'white',
    textAlign: 'center',
    shadowColor: 'black',
    color: 'black',
    shadowOffset: {
      width: 50,
      height: 50,
    },
    shadowOpacity: 10,
    shadowRadius: 10,
    elevation: 20,
  },
  focusCell: {
    borderColor: 'lightgrey',
  },

  button: {
    alignItems: 'center',
    backgroundColor: `#5b5f97`,
    padding: 13,
    width: 340,
    marginTop: 10,
    borderRadius: 50,
    textShadowColor: 'red',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 5,
  },
});

export default OTP;
