// src/screens/Comanda.js
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import * as Haptics from 'expo-haptics'; // Recurso nativo para confirmar ações [cite: 8]
import { cardapio } from '../services/apiMock'; // Nosso cardápio simulado [cite: 11]

export default function Comanda({ navigation, route }) {
  // Recebemos os dados passados pela tela anterior
  const { mesaId, numeroMesa } = route.params;

  // Estado para armazenar os itens que foram adicionados à comanda desta mesa [cite: 11]
  const [itensComanda, setItensComanda] = useState([]);

  // Função para adicionar um item ou aumentar sua quantidade [cite: 19]
  const adicionarItem = (itemDoCardapio) => {
    // RECURSO NATIVO: Vibração leve para confirmar que o item entrou [cite: 8]
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setItensComanda((itensAtuais) => {
      // Verifica se o item já foi adicionado antes
      const itemExiste = itensAtuais.find((i) => i.id === itemDoCardapio.id);

      if (itemExiste) {
        // Se já existe, apenas aumenta a quantidade [cite: 11]
        return itensAtuais.map((i) =>
          i.id === itemDoCardapio.id ? { ...i, quantidade: i.quantidade + 1 } : i
        );
      }
      // Se é a primeira vez, adiciona o item com quantidade 1 [cite: 11]
      return [...itensAtuais, { ...itemDoCardapio, quantidade: 1, observacao: '' }];
    });
  };

  // Função para diminuir a quantidade ou remover o item [cite: 19]
  const removerItem = (itemId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setItensComanda((itensAtuais) => {
      const itemExiste = itensAtuais.find((i) => i.id === itemId);

      if (itemExiste.quantidade === 1) {
        // Se só tem 1 unidade, remove o item da lista [cite: 19]
        return itensAtuais.filter((i) => i.id !== itemId);
      }
      // Caso contrário, apenas diminui 1 da quantidade
      return itensAtuais.map((i) =>
        i.id === itemId ? { ...i, quantidade: i.quantidade - 1 } : i
      );
    });
  };

  // Função para calcular o valor total acumulado na comanda [cite: 11, 19]
  const calcularTotal = () => {
    const total = itensComanda.reduce((acumulador, item) => {
      return acumulador + item.preco * item.quantidade;
    }, 0);
    return total.toFixed(2);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mesaTitulo}>Mesa {numeroMesa} — Pedidos</Text>

      {/* PARTE DE CIMA: O Cardápio disponível para escolha  */}
      <Text style={styles.seccionTitulo}>📖 Toque no item para adicionar:</Text>
      <FlatList
        data={cardapio}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.cardapioCard} onPress={() => adicionarItem(item)}>
            <View>
              <Text style={styles.itemNome}>{item.nome}</Text>
              <Text style={styles.itemCategoria}>{item.categoria.toUpperCase()}</Text>
            </View>
            <Text style={styles.itemPreco}>R$ {item.preco.toFixed(2)}</Text>
          </TouchableOpacity>
        )}
        style={styles.listaCardapio}
      />

      {/* PARTE DO MEIO: Resumo do que já foi pedido nesta mesa [cite: 11] */}
      <Text style={styles.seccionTitulo}>🛒 Itens Selecionados:</Text>
      {itensComanda.length === 0 ? (
        <Text style={styles.listaVazia}>Nenhum item adicionado ainda.</Text>
      ) : (
        <FlatList
          data={itensComanda}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.pedidoCard}>
              <View style={styles.pedidoInfo}>
                <Text style={styles.itemNome}>{item.nome}</Text>
                <Text style={styles.pedidoQtd}>Qtd: {item.quantidade}</Text>
              </View>
              <View style={styles.pedidoAcoes}>
                <Text style={styles.pedidoSubtotal}>R$ {(item.preco * item.quantidade).toFixed(2)}</Text>
                <TouchableOpacity style={styles.btnRemover} onPress={() => removerItem(item.id)}>
                  <Text style={styles.btnRemoverTexto}>-</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          style={styles.listaPedido}
        />
      )}

      {/* PARTE DE BAIXO: Rodapé fixo com o Total Dinâmico e Avançar [cite: 14, 16] */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>TOTAL:</Text>
          <Text style={styles.totalValor}>R$ {calcularTotal()}</Text>
        </View>
        <Button
          title="Fechar Comanda"
          color="#007bff"
          disabled={itensComanda.length === 0} // Só deixa avançar se tiver itens na mesa
          onPress={() => navigation.navigate('ResumoConta', { 
            mesaId, 
            numeroMesa, 
            itensComanda, 
            totalFinal: calcularTotal() 
          })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 15 },
  mesaTitulo: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 15, textAlign: 'center' },
  seccionTitulo: { fontSize: 14, fontWeight: 'bold', color: '#6c757d', marginTop: 10, marginBottom: 5 },
  listaCardapio: { maxHeight: '40%' }, // Limita o tamanho para sobrar espaço para o pedido
  listaPedido: { flex: 1, marginTop: 5 },
  listaVazia: { textAlign: 'center', color: '#999', marginVertical: 20, fontStyle: 'italic' },
  
  // Cards do Cardápio
  cardapioCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#fff', padding: 12, marginBottom: 8, borderRadius: 8,
    borderWidth: 1, borderColor: '#e9ecef'
  },
  itemNome: { fontSize: 16, fontWeight: '600', color: '#212529' },
  itemCategoria: { fontSize: 11, color: '#868e96', fontWeight: 'bold', marginTop: 2 },
  itemPreco: { fontSize: 16, fontWeight: 'bold', color: '#28a745' },

  // Cards do Pedido Atual
  pedidoCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#e9ecef', padding: 12, marginBottom: 6, borderRadius: 8
  },
  pedidoInfo: { flex: 1 },
  pedidoQtd: { fontSize: 13, color: '#495057', marginTop: 2 },
  pedidoAcoes: { flexDirection: 'row', alignItems: 'center' },
  pedidoSubtotal: { fontSize: 15, fontWeight: 'bold', marginRight: 15, color: '#333' },
  btnRemover: { backgroundColor: '#dc3545', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  btnRemoverTexto: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  // Rodapé fixo
  footer: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginTop: 10, elevation: 4 },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#495057' },
  totalValor: { fontSize: 22, fontWeight: 'bold', color: '#212529' }
});