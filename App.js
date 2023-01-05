
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';


const {width : SCREEN_WIDTH} = Dimensions.get('window');

const API_KEY = "075a26a186bdacde772a0af27def0a93";

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    
    if (!granted) {
      setOk(false);
    };
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({});
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps : false});
    setCity(location[0].city);
    console.log(latitude);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    setDays(json.daily);
    
  };
  useEffect(() => {
    getWeather();
  }, []);
  return (
      <View style={styles.container}>
        <View style={styles.city}>
          <Text style={styles.cityName}>{city}</Text>
        </View>
        <ScrollView pagingEnabled horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weather}>
          {days.length === 0 ? ( 
            <View style={styles.day}>
              <ActivityIndicator size="large" color="white" style={{marginTop : 10}} />
            </View> 
            ) : ( 
              days.map((day, index) => 
              <View key={index} style={styles.day}>
                <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(0)}°C</Text>
                <Text style={styles.description}>{day.weather[0].main}</Text>
                <Text style={styles.tinyText}>{day.weather[0].description}</Text>
              </View>
              )
            )}
        </ScrollView>
      </View>
    );
}
const styles = StyleSheet.create({
  container : {
    flex : 1,
    backgroundColor : "tomato"
  },
  city : {
    flex : 1,
    justifyContent : "center",
    alignItems : "center"
  },
  cityName : {
    fontSize : 68,
    fontWeight : '600'
  },
  weather : {
    
  },
  day : {
    width : SCREEN_WIDTH,
    alignItems : "center"
  },
  temp : {
    marginTop : 50,
    fontSize : 178,
  },
  description : {
    marginTop : -30,
    fontSize : 60
  },
  tinyText : {
    fontSize : 20
  }
})

