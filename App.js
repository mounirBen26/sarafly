import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import Home from './screens/home';
import BankCurrencies from './screens/bankCurryncies';
import Converter from './screens/converter';
import { HankenGrotesk_500Medium, HankenGrotesk_300Light } from '@expo-google-fonts/hanken-grotesk';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useState, useEffect } from 'react';
import { load } from 'cheerio';
import axios from 'axios';
import exchangeIcon from './assets/countries/money.png';
import * as SplashScreen from 'expo-splash-screen';

// SplashScreen.preventAutoHideAsync();
// setTimeout(SplashScreen.hideAsync, 2000);

const Tab = createMaterialTopTabNavigator();

export default function App() {
  const [data, setData] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  let wordsToCheck = ['americain', 'canadien', 'tunisien', 'euro', 'saoudien', 'turque', 'paysera', 'suisse', 'marocain', 'chinoi', 'sterling', 'paysera'];
  const pattern = /\d+./g;

  useEffect(() => {
    const fetchData = async () => {
      let country = '';
      let currencyList = [];
      try {
        const url = 'https://vikizia.com/devise.php';

        const response = await axios.get(url);
        const html = response.data;
        const $ = load(html);

        const pTagsWithBox = $('p[class*="box"]');
        const extractedData = [];
        pTagsWithBox.each((index, element) => {
          let elementText = $(element).text().toLowerCase();

          wordsToCheck.forEach((word) => {
            if (elementText.includes(word)) {
              country = word;
            }
          });

          currencyList.push(country);

          let matches = elementText.match(pattern);
          if (matches) {
            currencyList.push(...matches);
            extractedData.push([...currencyList]);
          }
          currencyList = [];
        });

        setData(extractedData);
        setIsDataFetched(true);
      } catch (error) {
        console.error(`There was an error fetching the URL: ${error}`);
      }
    };

    fetchData();
  }, []);

  const [loaded] = useFonts({
    HankenGrotesk_300Light,
    HankenGrotesk_500Medium,
  });

  if (!loaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <View style={{ flex: 0, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: 50, marginBottom: 10 }}>
        <Text style={styles.title}>Sarafly</Text>
        <Text style={{ fontFamily: 'HankenGrotesk_300Light', fontSize: 12 }}> (Devises Radar)</Text>
        <Image source={exchangeIcon} style={{ width: 30, height: 30, marginLeft: 10 }} />
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
          tabBarLabelStyle: { fontSize: 16, fontFamily: 'HankenGrotesk_500Medium', textTransform: 'none' },
          tabBarStyle: { backgroundColor: '#FFEEDD', width: '90%', alignSelf: 'center', borderRadius: 10 },
          tabBarIndicatorStyle: { backgroundColor: 'green' },
          tabBarPressColor: '#FFD8BE',
        }}
      >
        <Tab.Screen name="Informel">
          {props => <Home {...props} data={isDataFetched ? data : []} />}
        </Tab.Screen>
        <Tab.Screen name="Officiel" component={BankCurrencies} />
        <Tab.Screen name="Converter"  >
          {props => <Converter {...props} data={isDataFetched ? data : []} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginVertical: 10,
    fontFamily: 'HankenGrotesk_500Medium',
  },
});
