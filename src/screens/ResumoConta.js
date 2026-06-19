// src/screens/ResumoConta.js
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as Haptics from 'expo-haptics'; // Recurso nativo para ação crítica

export default function ResumoConta({ route, navigation }) {
  // Recebemos todos os dados da comanda que foram passados pela tela anterior
  const { mesaId, numeroMesa, itensComanda, totalFinal } = route.params;

  // Função para simular o fechamento definitivo da mesa
  const finalizarComanda = () => {
    // RECURSO NATIVO: Alerta tátil de sucesso (dupla vibração bem definida)
    Haptics.notificationAsync(Haptics.NotificationType.Success);

    // Exibe um aviso nativo do celular confirmando a operação
    Alert.alert(
      "Comanda Encerrada!",
      `A conta da Mesa ${numeroMesa} foi fechada com sucesso.\nTotal: R$ ${totalFinal}`,
      [
        { 
          text: "Concluir", 
          onPress: () => navigation.popToTop() // Reseta o histórico de telas e volta para o Salão
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Conferência de Conta</Text>
      <Text style={styles.mesaSubtitulo}>Mesa {numeroMesa}</Text>
      
      <Text style={styles.seccionTitulo}>📋 Extrato do Consumo:</Text>
      
      <FlatList
        data={itensComanda}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemLinha}>
            <Text style={styles.itemTexto}>
              {item.quantidade}x {item.nome}
            </Text>
            <Text style={styles.itemSubtotal}>
              R$ {(item.preco * item.quantidade).toFixed(2)}
            </Text>
          </View>
        )}
        style={styles.lista}
      />

      {/* Exibição do valor final consolidado */}
      <View style={styles.cardTotal}>
        <Text style={styles.totalLabel}>TOTAL DA CONTA:</Text>
        <Text style={styles.totalValor}>R$ {totalFinal}</Text>
      </View>

      {/* Botão crítico de fechamento */}
      <TouchableOpacity style={styles.btnConfirmar} onPress={finalizarComanda}>
        <Text style={styles.btnTexto}>Confirmar e Liberar Mesa</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#212529', textAlign: 'center' },
  mesaSubtitulo: { fontSize: 18, color: '#6c757d', textAlign: 'center', marginBottom: 20, fontWeight: '500' },
  seccionTitulo: { fontSize: 13, fontWeight: 'bold', color: '#868e96', marginBottom: 10, textTransform: 'uppercase' },
  lista: { flex: 1, marginBottom: 15 },
  itemLinha: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderColor: '#e9ecef' 
  },
  itemTexto: { fontSize: 16, color: '#495057' },
  itemSubtotal: { fontSize: 16, fontWeight: '600', color: '#212529' },
  
  cardTotal: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 12, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#dee2e6'
  },
  totalLabel: { fontSize: 15, fontWeight: 'bold', color: '#495057' },
  totalValor: { fontSize: 24, fontWeight: 'bold', color: '#dc3545' },
  
  btnConfirmar: { 
    backgroundColor: '#28a745', 
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: 'center',
    elevation: 2
  },
  btnTexto: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});