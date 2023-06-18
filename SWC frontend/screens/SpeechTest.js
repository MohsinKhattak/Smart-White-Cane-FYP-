import {useState,useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import {StyleSheet,ScrollView,FlatList, Pressable, Text, View, Image, Button, TouchableOpacity, TextInput,LinearGradient, Keyboard } from 'react-native';
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import Tts from 'react-native-tts';
import Voice from "@react-native-voice/voice";
  import RNFS from 'react-native-fs';
  import { FileSystem } from 'react-native';

const SpeechTest=({navigation})=> {

  useEffect(() => {
    //Setting callbacks for the process status
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
   // Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

    return () => {
      //destroy the process after switching the screen
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

    const [fileContents, setFileContents] = useState('');
    // const path="screens\TestFile.txt"

//   useEffect(() => {
//     checkIfFileExists()
//     // RNFS.readFile('/TestFile.txt', 'utf8') // Read the file with the specified path
//     //   .then(contents => {
//     //     setFileContents(contents); // Update the state with the contents of the file
//     //     console.log("done")
//     //   })
//     //   .catch(error => {
//     //     console.log(error);
//     //   });
//   }, []);
//   const checkIfFileExists = async () => {
//     try {
//       const result = await FileSystem.existsAsync("./TestFile.txt");
//       if (result) {
//         console.log(`${filePath} exists`);
//       } else {
//         console.log(`${filePath} does not exist`);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };
    // useEffect(()=>{
    //     componentWillUnmount() {
    //         Voice.destroy().then(Voice.removeAllListeners);
    //       }
    // },[])
    readFile = async (MyPath) => {
        try {
          const path =MyPath+ "/TestFile.txt";
          const contents = await RNFS.readFile(path, "utf8");
          return("" + contents);
        } catch (e) {
          alert("" + e);
        }
      };

    const [recognized, setRecognized]=useState("");
    const [pitch, setPitch]=useState("");
    const [error, setError]=useState("");
    const [end, setEnd]=useState("");
    const [started, setStarted]=useState(false);
    const [results, setResults]=useState([]);
    const [partialResults, setPartialResults]=useState([]);
   const [display, setDisplay]=useState("");


    onSpeechStart = (e) => {
        console.log("onSpeechStart: ", e);
        setStarted(true)
      };

    onSpeechEnd = (e) => {
        console.log("onSpeechEnd: ", e);
        
          setEnd("√") 
          setStarted(false) 
      };
   
      const onSpeechError = (e) => {
        //Invoked when an error occurs.
        console.log('onSpeechError: ', e);
        setError(JSON.stringify(e.error));
      };

      const onSpeechPartialResults = (e) => {
        //Invoked when any results are computed
      //  console.log('onSpeechPartialResults: ', e);
        setPartialResults(e.value);
      };

      onSpeechResults = (e) => {
        console.log("onSpeechResults: ", e);
        
          setResults(e.value[0]) 
          console.log("results",e.value[0])
          if(e.value[0]=="Go to navigation page"){
            alert("navigating")
          }

          // if(e.includes("Go to navigation page")){
          //   alert("navigating")
          // }
        
      };
      _startRecognizing = async () => {
        
        try {
          await Voice.start("en-US");
          setRecognized ("")
          setPitch ("")
          setError("")
          setStarted (false)
          setResults ([])
          setPartialResults ([])
          setEnd("")
        //  this.props.onSpeechStart();
          console.log("start recognized")
        } catch (e) {
          console.error("start error",e);
        }
      };
    
      // _destroyRecognizer = async () => {
      //   try {
      //     await Voice.destroy()
      //     console.log("destroyed");
      //   } catch (e) {
      //     console.error("destroy error",e);
      //   }
      //   setRecognized ("")
      //   setPitch ("")
      //   setError("")
      //   setStarted (false)
      //   setResults ([])
      //   setPartialResults ([])
      //   setEnd("")
      // };


 // const navigation = useNavigation();
  function navigateToAdminLoginPage() {
    const nav = "Admin Login";
    Tts.speak(nav);
  }
  function navigateToHomePage() {
    const nav = "Home Page";
    Tts.speak(nav);
  }
  const [fdata, setFdata] = useState({
    email: '',
    password: '',
     
})
const [eemail, setEemail] = useState("")

const [errormsg, setErrormsg] = useState(null);

const Sendtobackend = () => {
  
    // console.log(fdata);
    if (
       // fdata.email == '' ||
        fdata.password == '' ) {
        setErrormsg('All fields are required');
        return;
    }
    else {
        alert(eemail)
        // navigateToHomePage()
            navigation.navigate("Login")
        
    }

}

  return (
    <Pressable style={styles.container} onLongPress={_startRecognizing}>

    <View style={{marginTop:40,}}>
    <Text style={styles.heading}>Speech Test</Text>
    <Text style={styles.heading}>Page</Text>
    </View>

    <View>
    <Image source={require('../assets/blind.png')}  size={20}
      style={{width:150, height:150}}/>
    </View>

    {/* <Button title="AppFilesDir" onPress={() => this.readFile(RNFS.ExternalDirectoryPath)} />
     <Button title="InternalStorageDir" onPress={() => this.readFile(RNFS.ExternalStorageDirectoryPath)} /> */}

     <View style={styles.box}>
        
        

        {/* <TextInput
            style={styles.input}
            onPressIn={() => setErrormsg(null)}
            onChangeText={(text) => setFdata({ ...fdata, email: text })}
          // onChangeText={() => setFdata({ results })}
            keyboardType='email-address'
            placeholder='Email Address'
            value={fdata.email}
        /> */}

      {/* <ScrollView style={{marginBottom: 42}}>
          {results.map((result, index) => {
            return (
              <Text
                key={`result-${index}`}
                style={styles.input}>
                {result}
              </Text>
            );
          })}
        </ScrollView> */}
        {/* <Text style={styles.input}>
            {`Results: \n ${results}`}
          </Text> */}
        {/* <FlatList
        data={results}
        renderItem={() => {<Text>{results}</Text>}}
        style={styles.input}
        // keyExtractor={item => item.id}
      /> */}

        <ScrollView style={styles.input}>
          {partialResults.map((result, index) => {
            return (
              <Text
                key={`partial-result-${index}`}
                // style={styles.input}
                >
                {result}
              </Text>
            );
          })}
        </ScrollView>

          <TextInput
            style={styles.input}
            onPressIn={() => setErrormsg(null)}
            onChangeText={(text) => setFdata({ ...fdata, password: text })}
           secureTextEntry={true}
            placeholder='Password'
            value={fdata.password}
        />

        {
          errormsg ? <Text style={styles.errormessage}>{errormsg}</Text> : null
        }
        <View >
        <TouchableOpacity style={{alignItems: "center",
        backgroundColor: `#5b5f97`,
        padding:12,
        borderRadius:15,
        width:205,
        marginLeft:60,marginTop:12}}
        onPress={() => {Sendtobackend();}}
         
        >
          <Text style={{color:"white",fontSize:20,fontWeight:"bold"}}>Login</Text>
        </TouchableOpacity>

         
    </View>
     </View>

     <View style={{flexDirection:'row',marginTop:20}}>
        <Text style={{fontSize:16}}>You are the admin? </Text>
        <TouchableOpacity
         onPress={()=>{navigation.navigate("AdminLogin")
         navigateToAdminLoginPage()
         }}
        >
          <Text style={{textDecorationLine:'underline', fontSize:17, color:'#483d8b', fontWeight:"bold"}}> Login </Text>
        </TouchableOpacity>
     </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffce8',
    alignItems: 'center',
    //justifyContent: 'center',
  },
  heading:{
    color:"#4B88A2",
    fontSize:45,
    alignSelf:'center',
    fontFamily:'serif',
    fontStyle:'italic'
  },
  box:{
    border:2,
    borderColor:'#5b5f97',
    borderWidth:2,
    height:220,
    width:330,
    margin:10,
    marginTop:40,
    backgroundColor:"#92AFD7",
    borderRadius:15,
    paddingTop:7,
    paddingBottom:12,
    justifyContent:"center"
  },
  input: {
    height: 40,
    marginTop: 22,
    marginBottom:4,
    marginRight:12,
    marginLeft:12,
    borderWidth: 1,
    backgroundColor:"white",
    borderColor:'#5b5f97',
    padding: 10,
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50
},
footer: {
    flex: Platform.OS === 'ios' ? 3 : 5,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30
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
},errormessage:{
  color:'red',
  marginLeft:12
}                

});

export default SpeechTest;
