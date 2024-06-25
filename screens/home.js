import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { load } from 'cheerio';
import axios from 'axios';
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
import radar from '../assets/countries/radar.png';

const Home = () => {
    const [data, setData] = useState([]);
    let wordsToCheck = ['americain', 'canadien', 'tunisien', 'euro', 'saoudien', 'turque', 'paysera', 'suisse', 'marocain', 'chinoi', 'sterling','paysera'];
    const pattern = /\d+./g;

    const countryImages = {
        americain: usa,
        canadien: canada,
        tunisien: tunisia,
        euro: euro,
        saoudien: saudi,
        turque: turkey,
        paysera: paysera,
        suisse: switzerland,
        marocain: morocco,
        chinoi: china,
        sterling: uk,
        paysera: paysera,
    };

    useEffect(() => {
        const fetchData = async () => {
            let country = '';
            let currencyList = [];
            try {
                const url = 'https://vikizia.com/devise.php';

                const response = await axios.get(url);
                const html = response.data;
                const $ = load(html);

                // Select <p> tags with a class name containing the word "box"
                const pTagsWithBox = $('p[class*="box"]');

                // Extract the text content from the selected elements
                const extractedData = [];
                pTagsWithBox.each((index, element) => {
                    let elementText = $(element).text().toLowerCase();
                    console.log('Element Text:', elementText); // Debug log

                    wordsToCheck.forEach((word) => {
                        if (elementText.includes(word)) {
                            country = word;
                        }
                    });

                    currencyList.push(country);

                    let matches = elementText.match(pattern);
                    if (matches) {
                        console.log('Matches:', matches); // Debug log
                        currencyList.push(...matches);
                        extractedData.push([...currencyList]); // Copy the current list
                    }
                    currencyList = [];
                });

                setData(extractedData);
                console.log('Extracted Data:', extractedData); // Debug log
            } catch (error) {
                console.error(`There was an error fetching the URL: ${error}`);
            }
        };

        fetchData();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 50, marginBottom: 20 }}>
            <Text style={styles.title}>Devises Radar</Text>
            <Image source={radar} style={{ width: 30, height: 30, marginLeft: 10 }} />
            </View>
            <Text style={styles.date}>Derniere Mise à jour: {new Date().toLocaleDateString()}</Text>
            {data.map((elem, index) => (
                <View key={index} style={styles.dataContainer}>
                    <Image source={countryImages[elem[0]]} style={{ width: 30, height: 30 }} />
                    <View style={{alignItems: 'center' }}>
                        <Text>{elem[2]} DA</Text>
                        <Text style={styles.currency}>Achat</Text>
                    </View>
                    <Text>-</Text>
                    <View style={{alignItems: 'center'}}>
                        <Text style={styles.value}>{elem[4]} DA</Text>
                        <Text style={styles.currency}>Vente</Text>
                    </View>
                    <Image source={algeria} style={{ width: 30, height: 30 }} />
                </View>
            ))}
        </ScrollView>
    );
}

export default Home;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: "white"
    },
    title: {
        fontSize: 24,
        marginVertical: 10,
        fontFamily: 'HankenGrotesk_500Medium',
    },
    dataContainer: {
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
    currency: {
        fontSize: 16,
        fontFamily: 'HankenGrotesk_300Light',
    },
    value: {
        fontSize: 16,
        fontFamily: 'HankenGrotesk_300Light',
    },
    currency: {
        fontSize: 12,
        fontFamily: 'HankenGrotesk_300Light',
    },
    date:{
        fontSize: 12,
        fontFamily: 'HankenGrotesk_300Light',   
        marginVertical: 5,
    }
});
