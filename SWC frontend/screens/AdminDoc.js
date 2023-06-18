import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';
import {useState, useEffect, useRef} from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {ip} from './ipAddress';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import * as Speech from "expo-speech";
const IP = `http://${ip}:4000`;
const AdminDoc = ({navigation}) => {
  const [images, setImages] = useState([]);
  useEffect(() => {
    // get the user id from async storage

    // make a GET request to fetch the user's images
    fetch(`${IP}/images`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        // set the images in state
        setImages(data);
        // console.log(data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const reloadData = () => {
    fetch(`${IP}/images`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        // set the images in state
        setImages(data);
        // console.log(data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const [info, setInfo] = React.useState([
    {
      key: 1,
      documentName: 'New Document 1',
      userName: 'Mohsin',
    },
    {
      key: 2,
      documentName: 'New Document 2',
      userName: 'Aishbah',
    },
    {
      key: 3,
      documentName: 'New Document 3',
      userName: 'Ehtisham',
    },
  ]);
  const deleteImage = imageId => {
    // Send a DELETE request to the backend route with the image ID
    fetch(`${IP}/images/${imageId}`, {
      method: 'DELETE',
    })
      .then(response => {
        // Check if the response was successful
        if (response.ok) {
          // Image deleted successfully
          console.log('Image deleted successfully');
          reloadData();
        } else if (response.status === 404) {
          // Image not found
          console.log('Image not found');
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
        <Text style={styles.heading}>Documents</Text>

        <View>
          {images.length === 0 ? (
            <Text>No documents saved</Text>
          ) : (
            <ScrollView style={{width: '100%', marginTop: 10}}>
              {images.map(image => (
                <TouchableOpacity
                  key={image.image_id}
                  style={styles.box}
                  onPress={() => {
                    openImage(image.image_id);
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={{uri: image.image_url}}
                      style={styles.image}
                    />
                    <Text style={styles.imageName}>{image.image_name}</Text>
                  </View>
                  <TouchableOpacity
                    style={{marginLeft: 10}}
                    onPress={() => {
                      deleteImage(image.image_id);
                    }}>
                    <AntDesign name="delete" size={40} />
                  </TouchableOpacity>
                </TouchableOpacity>
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
    padding: 20,
    //alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fffce8',
    paddingTop: 2,
    width: '100%',
    borderRadius: 5,
    paddingLeft: 30,
    paddingRight: 30,
  },
  image: {
    width: 120,
    height: 120,
    marginVertical: 10,
    marginLeft: 10,
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
    alignSelf: 'center',
    marginTop: 60,
  },
  box: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#5790A9',
    margin: 10,
    padding: 7,
    borderRadius: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 40,
  },
  ttext: {
    fontSize: 18,
    margin: 5,
    marginTop: -1,
    marginBottom: 9,
    color: 'white',
    marginLeft: 15,
  },
  imageName: {
    fontSize: 18,
    fontWeight: 'bold',
    // marginTop: 20,
    marginLeft: 8,
    color: 'white',
  },
});

export default AdminDoc;
