//extra tabnav

import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Documents from './Documents';
import TextRecognition from './TextRecognition';
import Homescreen from './Homescreen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// export default function TabNavigator({navigation}) {

const Tab = createBottomTabNavigator();
const Screen = () => {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        initialRouteName="Homescreen"
        screenOptions={{
          tabBarActiveTintColor: '#4A6FA5',
          tabBarInactiveTintColor: '#EA638C',
          tabBarStyle: {height: 70, backgroundColor: 'white', paddingTop: 5},
          tabBarLabelStyle: {fontSize: 16, paddingBottom: 4},
        }}>
        <Tab.Screen
          options={{
            tabBarStyle: {display: 'none'},
            headerShown: false,
            tabBarLabel: 'Documents',
            tabBarIcon: ({focused}) => (
              <FontAwesome
                name="camera"
                color={'black'}
                size={30}
                style={{color: focused ? `#4A6FA5` : '#EA638C'}}
              />
            ),
          }}
          name="Documents"
          component={Documents}
        />
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarLabel: 'Home',
            tabBarIcon: ({focused}) => (
              <FontAwesome
                name="home"
                color={'black'}
                size={38}
                style={{color: focused ? `#4A6FA5` : '#EA638C'}}
              />
            ),
          }}
          name="Home"
          component={Homescreen}
        />
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarLabel: 'Text Recognition',
            tabBarIcon: ({focused}) => (
              <FontAwesome
                name="camera"
                color={'black'}
                size={30}
                style={{color: focused ? `#4A6FA5` : '#EA638C'}}
              />
            ),
          }}
          name="TextRecognition"
          component={TextRecognition}
        />
      </Tab.Navigator>

      {/* <Tab.Navigator screenOptions={ {
            tabBarActiveTintColor:'#4A6FA5',tabBarInactiveTintColor:'#EA638C',
            tabBarStyle: { height: 100, backgroundColor:'white',paddingTop:5},
            tabBarLabelStyle: {fontSize: 17, paddingBottom:4 },
            } } > 
            <Tab.Screen options={{
            tabBarStyle: {display:'none'}, headerShown: false, tabBarLabel: 'Homescreen',
            tabBarIcon: ({ focused }) => ( 
            <FontAwesome name="home" color={"black"} size={38}
            style={{color: focused ? `#4A6FA5` : '#EA638C'}} />
            ), }} name="Homescreen" component={Homescreen} />
                  
            <Tab.Screen options={{ headerShown: false, tabBarLabel: 'Documents',
            tabBarIcon: ({ focused }) => (
            <FontAwesome name="camera" color={"black"} size={30}
            style={{color: focused ? `#4A6FA5` : '#EA638C'}}/> ), }}
            name="Documents" component={Documents}/>
                   
            <Tab.Screen options={{headerShown: false, tabBarLabel: 'TextRecognition',
            tabBarIcon: ({ focused }) => (
            <FontAwesome name="camera" color={"black"} size={38}
            style={{color: focused ? `#4A6FA5` : '#EA638C'}}/>),}}
            name="TextRecognition" component={TextRecognition}/>
          </Tab.Navigator> */}
    </View>
  );
};

//}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    height: '100%',
    backgroundColor: '#20b2aa',
    flexDirection: 'column',
  },
  innerContainer: {
    height: '78%',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 5,
  },
  topHeader: {
    height: '12%',
    width: '100%',
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 25,
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
});
export default Screen;
