import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function AdminHome({navigation}) {
  //const navigation = useNavigation();

  // function navigateToProfilePage() {
  //   const navigation = "User profiles";
  //   Speech.speak(navigation);
  // }
  // function navigateToUserDocsPage() {
  //   const navigation = "User Documents";
  //   Speech.speak(navigation);
  // }

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = () => {
    navigation.navigate('AdminLogin');
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.heading}>
          <Text style={styles.headingText}>Admin Panel</Text>
        </View>
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={toggleMenu} style={styles.profileIcon}>
            <FontAwesome5 name="user-circle" size={50} />
          </TouchableOpacity>
          {isMenuOpen && (
            <View style={styles.dropdownMenu}>
              <TouchableOpacity
                onPress={handleSignOut}
                style={styles.menuOption}>
                <Text style={styles.menuOptionText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <View style={styles.innerContainer}>
        <Text style={styles.innerContainerHeader}>Smart White Cane</Text>

        <View style={styles.mainContainer}>
          <TouchableOpacity
            style={styles.Touchables}
            onPress={() => {
              navigation.navigate('AdminProfiles');
              // navigateToProfilePage()
            }}>
            <Image
              style={styles.touchableLogo}
              source={require('../assets/blind.png')}
            />
            <Text style={styles.touchableText}>Profiles</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.Touchables}
            onPress={() => {
              navigation.navigate('AdminDoc');
              // navigateToUserDocsPage()
            }}>
            <Image
              style={styles.touchableLogo}
              source={require('../assets/folder.png')}
            />
            <Text style={styles.touchableText}>Documents</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    height: '100%',
    backgroundColor: '#4B88A2',
    flexDirection: 'column',
  },
  innerContainer: {
    flexDirection: 'column',
    height: '90%',
    backgroundColor: '#fffce8',
    width: '100%',
    borderRadius: 5,
  },
  topHeader: {
    height: '10%',
    width: '100%',
    justifyContent: 'flex-start',
    padding: 25,
    backgroundColor: '#4B88A2',
  },

  innerContainerHeader: {
    fontWeight: 'bold',
    fontSize: 35,
    marginTop: 30,
    fontFamily: 'serif',
    fontStyle: 'italic',
    alignSelf: 'center',
    marginBottom: 50,
    color: '#3A487D',
  },
  header: {
    height: '15%',
    width: '100%',
    justifyContent: 'flex-start',
    backgroundColor: '#4B88A2',
    flexDirection: 'row',
  },
  heading: {
    justifyContent: 'center',
    marginLeft: 10,
  },
  headingText: {
    fontSize: 18,
    fontFamily: 'serif',
    fontWeight: 'bold',
    color: '#fffce8',
  },
  profileHeader: {
    zIndex: 1,
    position: 'absolute',
    top: 13,
    right: 10,
  },
  profileIcon: {
    padding: 7,
    backgroundColor: '#fffce8',
    borderRadius: 50,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 40,
    right: 40,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 90,
    height: 45,
  },
  menuOption: {
    paddingVertical: 1,
  },
  menuOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  Touchables: {
    flexDirection: 'row',
    backgroundColor: '#5790A9',
    borderRadius: 15,
    padding: 10,
    borderWidth: 1,
    marginVertical: 10,
  },
  touchableLogo: {
    resizeMode: 'cover',
    width: 100,
    height: 100,
    marginTop: 5,
  },
  mainContainer: {
    margin: 15,
  },
  touchableText: {
    fontSize: 40,
    marginVertical: 30,
    marginHorizontal: 10,
    fontWeight: 'bold',
    color: 'white',
  },
});
