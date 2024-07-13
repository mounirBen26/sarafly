import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import algeria from '../assets/countries/algeria.png';
import canada from '../assets/countries/canada.png';
import china from '../assets/countries/china.png';
import euro from '../assets/countries/euro.png';
import morocco from '../assets/countries/morocco.png';
import saudi from '../assets/countries/saudi.png';
import switzerland from '../assets/countries/switzerland.png';
import tunisia from '../assets/countries/tunisia.png';
import turkey from '../assets/countries/turkey.png';
import uk from '../assets/countries/uk.png';
import usa from '../assets/countries/usa.png';

const BankCurrencies = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currencyList = ['EUR', 'USD', 'GBP', 'CAD', 'TND', 'SAR', 'TRY', 'CNY', 'CHF', 'MAD'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lastFetchTime = await AsyncStorage.getItem('lastFetchTime');
        const currentTime = new Date().getTime();
        const twentyFourHours = 24 * 60 * 60 * 1000;

        if (!lastFetchTime || currentTime - parseInt(lastFetchTime) > twentyFourHours) {
          const fetchedResponses = await Promise.all(
            currencyList.map(async (code) => {
              const url = `https://api.currencyapi.com/v3/latest?apikey=cur_live_uUDWqJFBnsPy1nojD2cHm0U0hLNmPPacC6ohQd2Q&currencies=DZD&base_currency=${code}`;
              const response = await fetch(url);
              const data = await response.json();

              const lastUpdated = data.meta?.last_updated_at || 'Unknown';
              const value = data.data?.DZD?.value;
              const formattedValue = value ? value.toFixed(2) : 'N/A';

              return { code, lastUpdated, value: formattedValue };
            })
          );

          setResponses(fetchedResponses);
          await AsyncStorage.setItem('lastFetchTime', currentTime.toString());
          await AsyncStorage.setItem('cachedResponses', JSON.stringify(fetchedResponses));
        } else {
          const storedResponses = await AsyncStorage.getItem('cachedResponses');
          if (storedResponses) {
            setResponses(JSON.parse(storedResponses));
          }
        }
      } catch (error) {
        setError(`Error fetching data: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (responses.length > 0) {
      AsyncStorage.setItem('cachedResponses', JSON.stringify(responses));
    }
  }, [responses]);

  const countryImages = {
    EUR: euro,
    USD: usa,
    GBP: uk,
    CAD: canada,
    TND: tunisia,
    SAR: saudi,
    TRY: turkey,
    CNY: china,
    CHF: switzerland,
    MAD: morocco,
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Derniere Mise à jour: {new Date().toLocaleDateString()}</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={responses}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={countryImages[item.code]} style={styles.flag} />
            <View style={styles.textContainer}>
              <Text style={styles.text}> 1 {item.code}</Text>
              <Text style={styles.value}> {item.value} DA</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 12,
    fontFamily: 'HankenGrotesk_300Light',
    marginBottom: 20,
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FFFFF0',
    padding: 18,
    marginVertical: 4,
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: '#9370db',
    fontFamily: 'HankenGrotesk_300Light',
  },
  flag: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontFamily: 'HankenGrotesk_300Light',
  },
  value: {
    fontSize: 16,
    fontFamily: 'HankenGrotesk_300Light',
    color: 'green',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default BankCurrencies;
