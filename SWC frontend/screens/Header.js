import { StyleSheet, Text, View, TouchableOpacity,Image } from "react-native";
// import { Camera, CameraType } from "expo-camera";
import { useState, useEffect, useRef } from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import Profiling from "./Profiling";

 const Header=({navigation})=> {
  
  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
      {/* <TouchableOpacity 
      onPress={() => {        
        navigation.navigate("Home")
      }}>
        <FontAwesome name="arrow-circle-left" size={50}/>
      </TouchableOpacity> */}
        <TouchableOpacity 
      onPress={() => {navigation.navigate("Profiling")}}>
        <FontAwesome5 name="user-circle" size={50}/>
      </TouchableOpacity>
      </View>
      

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 2,
    height: "12%",
    backgroundColor: "#20b2aa",
    flexDirection: "column",
  },
  
  topHeader: {
    // flexDirection:'row',
    width: "100%",
    // justifyContent: "space-between",
    padding: 1,
    marginTop:7,
    marginBottom:3,
    paddingRight:7,
    paddingLeft:7
  },
 
});

export default Header;