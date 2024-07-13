import { StyleSheet, Text, View, TextInput, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import algeria from '../assets/countries/algeria.png';
import canada from '../assets/countries/canada.png';
import china from '../assets/countries/china.png';
import euro from '../assets/countries/euro.png';
import morocco from '../assets/countries/morocco.png';
import paysera from '../assets/countries/paysera.jpeg';
import saudi from '../assets/countries/saudi.png';
import switzerland from '../assets/countries/switzerland.png';
import tunisia from '../assets/countries/tunisia.png';
import turkey from '../assets/countries/turkey.png';
import uk from '../assets/countries/uk.png';
import usa from '../assets/countries/usa.png';

const mapCurrencyValues = (data, items) => {
  // Create a mapping from currency name to value
  const currencyMap = data.reduce((acc, [name, , value]) => {
    acc[name] = value ? value.trim() : undefined;
    return acc;
  }, {});

  // Map each item to its corresponding value
  return items.map(item => {
    const currencyName = item.label.toLowerCase();
    let value;

    // Determine the value by matching the currency name
    switch (currencyName) {
      case 'euro':
        value = currencyMap['euro'];
        break;
      case 'usd':
        value = currencyMap['americain'];
        break;
      case 'gpb':
        value = currencyMap['sterling'];
        break;
      case 'cad':
        value = currencyMap['canadien'];
        break;
      case 'tnd':
        value = currencyMap['tunisien'];
        break;
      case 'sar':
        value = currencyMap['saoudien'];
        break;
      case 'try':
        value = currencyMap['turque'];
        break;
      case 'cny':
        value = currencyMap['chinoi'];
        break;
      case 'chf':
        value = currencyMap['suisse'];
        break;
      case 'mad':
        value = currencyMap['marocain'];
        break;
      default:
        value = item.value;
    }

    return { ...item, value: value || '0' };
  });
};

const Converter = ({ data }) => {
  const [result, setResult] = useState(0);
  const [amount, setAmount] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'EURO', value: 'euro', key: 'euro', icon: () => (<Image source={euro} style={styles.image} />) },
    { label: 'USD', value: 'usd', key: 'usd', icon: () => (<Image source={usa} style={styles.image} />) },
    { label: 'GPB', value: 'gpb', key: 'gpb', icon: () => (<Image source={uk} style={styles.image} />) },
    { label: 'CAD', value: 'cad', key: 'cad', icon: () => (<Image source={canada} style={styles.image} />) },
    { label: 'TND', value: 'tnd', key: 'tnd', icon: () => (<Image source={tunisia} style={styles.image} />) },
    { label: 'SAR', value: 'sar', key: 'sar', icon: () => (<Image source={saudi} style={styles.image} />) },
    { label: 'TRY', value: 'try', key: 'try', icon: () => (<Image source={turkey} style={styles.image} />) },
    { label: 'CNY', value: 'cny', key: 'cny', icon: () => (<Image source={china} style={styles.image} />) },
    { label: 'CHF', value: 'chf', key: 'chf', icon: () => (<Image source={switzerland} style={styles.image} />) },
    { label: 'MAD', value: 'mad', key: 'mad', icon: () => (<Image source={morocco} style={styles.image} />) },
  ]);

  // Update items with mapped currency values
  useEffect(() => {
    const updatedItems = mapCurrencyValues(data, items);
    setItems(updatedItems);
  }, [data]);

  // Calculate the conversion result
  useEffect(() => {
    if (value && amount) {
      const selectedCurrency = items.find(item => item.value === value);
      const numericValue = parseFloat(selectedCurrency.value);
      const convertedAmount = parseFloat(amount) * numericValue;
      setResult(convertedAmount.toFixed(2));
    } else {
      setResult(0);
    }
  }, [value, amount]);

  return (
    <View style={styles.container}>
      <Text style={styles.titlee}>Convertisseur de devise (Square - Achats)</Text>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        containerStyle={{ height: 40, width: 230, marginVertical: 20 }}
        style={{ backgroundColor: '#fafafa' }}
        dropDownStyle={{ backgroundColor: '#fafafa' }}
        labelStyle={{ color: 'black' }}
        placeholder="Choisir la devise"
      />
      
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder='Entrer un montant'
        onChangeText={(text) => setAmount(text)}
      />
      <View style={styles.inputContainer}>
        <Text style={{ fontSize: 20, fontFamily: 'HankenGrotesk_500Medium', width: 200, paddingLeft: 10, alignSelf: 'center' }}>{result} DA</Text>
        <Image source={algeria} style={styles.algeria} />
      </View>
    </View>
  );
};

export default Converter;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 10,
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    height: 50,
    width: 230,
    borderWidth: 1,
    borderColor: 'lightblue',
  },
  input: {
    height: 50,
    width: 230,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#1CAC78',
    borderRadius: 10,
    padding: 10,
    fontFamily: 'HankenGrotesk_500Medium',
    fontSize: 18,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titlee: {
    fontSize: 17,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'HankenGrotesk_500Medium',
  },
  algeria: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  image: {
    width: 30,
    height: 30,
  },
});
