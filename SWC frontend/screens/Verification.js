import {useState,useEffect} from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from "react-native";

export default function Verification({ navigation, route }) {
//   const { userdata } = route.params;

  const [errormsg, setErrormsg] = useState(null);
  const [userCode, setUserCode] = useState("XXXX");
  const [actualCode, setActualCode] = useState(1234);

//   useEffect(() => {
//     setActualCode(userdata[0]?.VerificationCode);
//   }, []);

  const Sendtobackend = () => {
    // console.log(userCode);
    // console.log(actualCode);

    if (userCode == "XXXX" || userCode == "") {
      setErrormsg("Please enter the code");
      return;}
    // } else if (userCode == actualCode) {
    //   // console.log('correct code');
    //   const fdata = {
    //     email: userdata[0]?.email,
    //     password: userdata[0]?.password,
    //     name: userdata[0]?.name,
    //     age: userdata[0]?.age,
        
    //   };

    //   fetch("http://10.113.4.68:3000/signUp", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(fdata),
    //   })
    //     .then((res) => res.json())
    //     .then((data) => {
    //       // console.log(data);
    //       if (data.message === "User Registered Successfully") {
    //         alert(data.message);
    //         navigation.navigate('Home');
    //       } else {
    //         alert("Something went wrong !! Try Signing Up Again");
    //       }
    //     });
    // } 
    
    else if (userCode != actualCode) {
      setErrormsg("Incorrect code");
      return;
    }
    else{
        navigation.navigate("Homescreen")
    }
  };
  return (
    <View style={styles.container}>
            <View style={{marginTop:40,}}>
    <Text style={styles.heading}>OTP screen</Text>
    </View>
            <View style={styles.modalstyle}>
          <Text>An OTP code has been sent to your Email. Kindly check and enter in the feild below.</Text>
          <TextInput
          placeholder='OTP code'
          style={styles.input}
          onChangeText={(text) => setUserCode(text)}
          onPressIn={() => setErrormsg(null)}
            keyboardType='numeric'
            maxLength={6}
          />
          <TouchableOpacity style={{alignItems: "center",
        backgroundColor: `#20b2aa`,
        padding:15,
        width:190,
        marginLeft:40,
        marginTop:18}}
         
          onPress={() => {
            Sendtobackend();
          }}
        >
          <Text>Validate</Text>
        </TouchableOpacity>
        {
                         errormsg ? <Text style={styles.errormessage}>{errormsg}</Text> : null
                }
          
        </View>
        </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading:{
    color:`#20b2aa`,
    fontSize:45,
    alignSelf:'center',
    fontFamily:'serif',
    fontStyle:'italic'
  },
  input: {
      height: 40,
      marginTop: 12,
      marginRight:12,
      marginLeft:12,
      borderWidth: 1,
      borderColor:'#20b2aa',
      padding: 10,
    },
    button:{
      alignItems: "center",
      backgroundColor: `#20b2aa`,
      padding:15,
      width:250,
      marginLeft:22,
     // marginTop:10
    },
    modalstyle:{
      flex:1,
      backgroundColor:'white',
      // width:'100%',
       height:400,
      margin:10,
      marginTop:100,
      marginBottom:100,
      padding:16,
      justifyContent:'center',
      alignContent:'center',
      borderColor:`#20b2aa`,
      borderWidth:4,
      borderRadius:10,
    }          
});
