// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   Pressable,
//   ScrollView,
// } from 'react-native';
// import {useState, useEffect, useRef} from 'react';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import {useNavigation} from '@react-navigation/native';
// import React from 'react';
// import {ip} from './ipAddress';

// // import * as Speech from "expo-speech";
// const IP = `http://${ip}:4000`;
// const AdminProfiles = ({navigation}) => {
//   const [users, setUsers] = useState([
//     {
//       key: 1,
//       name: 'David',
//       age: '23',
//       phone: '+92 314 5584473',
//     },
//     {
//       key: 2,
//       name: 'David2',
//       age: '24',
//       phone: '+92 314 5584473',
//     },
//     {
//       key: 3,
//       name: 'David3',
//       age: '26',
//       phone: '+92 314 5584473',
//     },
//     {
//       key: 4,
//       name: 'David4',
//       age: '25',
//       phone: '+92 314 5584473',
//     },
//   ]);

//   useEffect(() => {
//     fetch(`${IP}/users`)
//       .then(response => response.json())
//       .then(data => {
//         console.log(data);
//         setUsers(data);
//       })
//       .catch(error => console.error(error));
//   }, []);

//   return (
//     <Pressable style={styles.container}>
//       <View style={styles.topHeader}>
//         <TouchableOpacity
//           onPress={() => {
//             navigation.navigate('Profiling');
//           }}>
//           <FontAwesome5 name="user-circle" size={50} />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.innerContainer}>
//         <Text style={styles.heading}>User Profiles</Text>

//         <View>
//           {users.length === 0 ? (
//             <Text>No registered users</Text>
//           ) : (
//             <ScrollView style={{width: '100%', marginTop: 10}}>
//               {users.map(user => (
//                 <View key={user.key}>
//                   <View style={styles.box} key={user.key}>
//                     <View style={{flexDirection: 'row', marginTop: 4}}>
//                       <FontAwesome name="user" size={27} />
//                       <Text style={styles.ttext}>Name: {user.name}</Text>
//                     </View>
//                     <View style={{flexDirection: 'row', marginTop: 4}}>
//                       <FontAwesome name="calendar" size={27} />
//                       <Text style={styles.ttext}>Age: {user.age}</Text>
//                     </View>
//                     <View style={{flexDirection: 'row', marginTop: 4}}>
//                       <FontAwesome name="phone" size={27} />
//                       <Text style={styles.ttext}>Phone No: {user.phone}</Text>
//                     </View>
//                   </View>
//                 </View>
//               ))}
//             </ScrollView>
//           )}
//         </View>

//       </View>
//     </Pressable>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     height: '100%',
//     backgroundColor: '#4B88A2',
//     flexDirection: 'column',
//   },
//   innerContainer: {
//     // flexDirection:'row',
//     height: '90%',
//     padding: 5,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#fffce8',
//     paddingTop: 20,
//     width: '100%',
//     borderRadius: 5,
//   },
//   topHeader: {
//     flexDirection: 'row',
//     height: '10%',
//     width: '100%',
//     justifyContent: 'space-between',
//     padding: 1,
//     marginBottom: 3,
//     marginTop: 9,
//     paddingRight: 7,
//     paddingLeft: 7,
//   },

//   heading: {
//     color: `#3A487D`,
//     fontSize: 50,
//     // alignSelf:'center',
//     fontFamily: 'serif',
//     fontStyle: 'italic',
//     paddingTop: 15,
//   },
//   box: {
//     flexDirection: 'column',
//     width: '95%',
//     alignSelf: 'center',
//     backgroundColor: '#5790A9',
//     margin: 10,
//     padding: 7,
//     borderRadius: 15,
//     justifyContent: 'space-between',
//   },
//   ttext: {
//     fontSize: 18,
//     margin: 5,
//     marginTop: -1,
//     marginBottom: 9,
//     color: 'white',
//     marginLeft: 15,
//   },
// });

// export default AdminProfiles;

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from 'react-native';
import {useState, useEffect, useRef} from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {ip} from './ipAddress';

// import * as Speech from "expo-speech";
const IP = `http://${ip}:4000`;
const AdminProfiles = ({navigation}) => {
  const [users, setUsers] = useState([
    {
      key: 1,
      name: 'David',
      age: '23',
      phone: '+92 314 5584473',
    },
    {
      key: 2,
      name: 'David2',
      age: '24',
      phone: '+92 314 5584473',
    },
    {
      key: 3,
      name: 'David3',
      age: '26',
      phone: '+92 314 5584473',
    },
    {
      key: 4,
      name: 'David4',
      age: '25',
      phone: '+92 314 5584473',
    },
    {
      key: 5,
      name: 'David5',
      age: '26',
      phone: '+92 314 5584473',
    },
    {
      key: 6,
      name: 'David6',
      age: '29',
      phone: '+92 314 5584473',
    },
  ]);

  useEffect(() => {
    fetch(`${IP}/users`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setUsers(data);
      })
      .catch(error => console.error(error));
  }, []);
  const deleteUser = userId => {
    // Send a DELETE request to the backend route with the image ID
    fetch(`${IP}/users/delete/${userId}`, {
      method: 'DELETE',
    })
      .then(response => {
        // Check if the response was successful
        if (response.ok) {
          // Image deleted successfully
          console.log('User deleted');
          reloadData();
        } else if (response.status === 404) {
          // Image not found
          console.log('User not found');
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
    fetch(`${IP}/users`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setUsers(data);
        console.log('Data reloaded');
      })
      .catch(error => console.error(error));
  }
  return (
    <Pressable style={styles.container}>
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AdminHome');
          }}>
          <FontAwesome5
            name="arrow-left"
            size={40}
            marginLeft={10}
            marginTop={7}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.innerContainer}>
        <Text style={styles.heading}>User Profiles</Text>

        <View style={{height: '100%'}}>
          {users.length === 0 ? (
            <Text>No registered users</Text>
          ) : (
            <ScrollView style={{width: '90%', marginTop: 10}}>
              {users.map(user => (
                <View key={user.key} style={styles.fullbox}>
                  <View style={styles.box} key={user.key}>
                    <View style={{flexDirection: 'row', marginTop: 4}}>
                      <FontAwesome name="user" size={27} />
                      <Text style={styles.ttext}>Name: {user.name}</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 4}}>
                      <FontAwesome name="calendar" size={27} />
                      <Text style={styles.ttext}>Age: {user.age}</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 4}}>
                      <FontAwesome name="phone" size={27} />
                      <Text style={styles.ttext}>Phone No: {user.phone}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteIcon}
                    onPress={() => {
                      deleteUser(user.key);
                    }}>
                    <MaterialCommunityIcons
                      name="delete"
                      size={40}
                      color={'white'}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
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
  innerContainer: {
    // flexDirection:'row',
    height: '90%',
    padding: 5,
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
    paddingTop: 20,
  },
  fullbox: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#5790A9',
    marginTop: 10,
    borderRadius: 15,
    alignItems: 'center',
    overflow: 'scroll',
  },
  box: {
    flexDirection: 'column',
    width: '88%',
    alignSelf: 'center',
    backgroundColor: '#5790A9',
    marginTop: 10,
    padding: 7,
    borderRadius: 15,
    justifyContent: 'space-between',
  },
  deleteIcon: {
    marginRight: 5,
    marginLeft: -10,
  },
  ttext: {
    fontSize: 18,
    margin: 5,
    marginTop: -1,
    marginBottom: 9,
    color: 'white',
    marginLeft: 15,
  },
});

export default AdminProfiles;
