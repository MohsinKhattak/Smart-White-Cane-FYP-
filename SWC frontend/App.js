import * as React from 'react';
import {Button, View, Text, TouchableOpacity} from 'react-native';
import {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Homescreen from './screens/Homescreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Documents from './screens/Documents';
import TextRecognition from './screens/TextRecognition';
import Profiling from './screens/Profiling';
import Register from './screens/Register';
import Verification from './screens/Verification';
import TabNavigator from './screens/TabNavigator';
import OTP from './screens/OTP';
import Frontpage from './screens/Frontpage';
import Login from './screens/Login';
import AdminLogin from './screens/AdminLogin';
import AdminHome from './screens/AdminHome';
import SpeechTest from './screens/SpeechTest';
import Speech from './screens/Speech';
import AdminProfiles from './screens/AdminProfiles';
import AdminDoc from './screens/AdminDoc';

export default function App() {
  const Stack = new createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        // initialRouteName="TabNavigator"
      >
        <Stack.Screen name="Frontpage" component={Frontpage} />
        <Stack.Screen name="SpeechTest" component={SpeechTest} />
        <Stack.Screen name="Speech" component={Speech} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Homescreen" component={Homescreen} />
        <Stack.Screen name="Profiling" component={Profiling} />
        <Stack.Screen name="Verification" component={Verification} />
        <Stack.Screen name="OTP" component={OTP} />
        <Stack.Screen name="AdminLogin" component={AdminLogin} />
        <Stack.Screen name="AdminHome" component={AdminHome} />
        <Stack.Screen name="AdminProfiles" component={AdminProfiles} />
        <Stack.Screen name="AdminDoc" component={AdminDoc} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
