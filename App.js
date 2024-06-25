import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import Home from './screens/home';
import  {HankenGrotesk_500Medium,HankenGrotesk_300Light} from '@expo-google-fonts/hanken-grotesk'


export default function App() {
  const [loaded] = useFonts({
    HankenGrotesk_300Light,
    HankenGrotesk_500Medium
  });

  if (!loaded) {
    return null;
  }
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Home />
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
});
