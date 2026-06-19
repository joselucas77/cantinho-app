// src/screens/MesasList.js
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics'; // Importa o recurso nativo de vibração
import { mesasIniciais } from '../services/apiMock'; // Importa as nossas 8 mesas prontas

export default function MesasList({ navigation }) {
  // Guardamos as mesas no estado do componente
  const [mesas, setMesas] = useState(mesasIniciais);

  // Função disparada ao clicar em uma mesa
  const selecionarMesa = (mesa) => {
    // RECURSO NATIVO: Gera uma vibração leve de confirmação para o garçom
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Navega para a tela de comanda levando o ID e o número da mesa clicada
    navigation.navigate('Comanda', { mesaId: mesa.id, numeroMesa: mesa.numero });
  };

  // Como cada quadradinho de mesa vai ser desenhado na tela
  const renderMesa = ({ item }) => {
    // Define a cor baseada no status da mesa (Livre ou Comanda Aberta)
    const estiloStatus = item.status === 'livre' ? styles.mesaLivre : styles.mesaOcupada;

    return (
      <TouchableOpacity 
        style={[styles.mesaCard, estiloStatus]} 
        onPress={() => selecionarMesa(item)}
      >
        <Text style={styles.mesaNumero}>Mesa {item.numero}</Text>
        <Text style={styles.mesaStatus}>
          {item.status === 'livre' ? '🟢 Livre' : '🔴 Aberta'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instrucao}>Selecione uma mesa para gerenciar os pedidos:</Text>
      
      {/* O FlatList cria uma lista eficiente. O numColumns={2} divide em duas colunas */}
      <FlatList
        data={mesas}
        renderItem={renderMesa}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listaGrid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 10,
  },
  instrucao: {
    fontSize: 15,
    color: '#6c757d',
    textAlign: 'center',
    marginVertical: 15,
    fontWeight: '500',
  },
  listaGrid: {
    paddingBottom: 20,
  },
  mesaCard: {
    flex: 1,
    aspectRatio: 1, // Garante que os cards fiquem perfeitamente quadrados
    margin: 10,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, // Sombra suave para o Android
  },
  mesaLivre: {
    backgroundColor: '#d4edda', // Verde claro
    borderWidth: 1.5,
    borderColor: '#c3e6cb',
  },
  mesaOcupada: {
    backgroundColor: '#f8d7da', // Vermelho claro
    borderWidth: 1.5,
    borderColor: '#f5c6cb',
  },
  mesaNumero: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  mesaStatus: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: '600',
    color: '#555555',
  },
});