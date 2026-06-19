// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MesasList from '../screens/MesasList';
import Comanda from '../screens/Comanda';
import ResumoConta from '../screens/ResumoConta';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MesasList">
        <Stack.Screen name="MesasList" component={MesasList} options={{ title: 'Cantinho - Mesas' }} />
        <Stack.Screen name="Comanda" component={Comanda} options={{ title: 'Detalhes da Comanda' }} />
        <Stack.Screen name="ResumoConta" component={ResumoConta} options={{ title: 'Fechar Conta' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}