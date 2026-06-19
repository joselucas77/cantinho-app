import React from 'react';
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';

// 1. Imports dos arquivos que você isolou
import { escolherIcone, formatarTempoDecorrido } from './src/utils/helpers';
import styles from './src/styles/appStyles';
import COLORS from './src/config/colors';
import useAppLogic from './src/hooks/useAppLogic';


// Componentes pequenos reutilizáveis

const HeaderBar = ({ titulo, onVoltar }) => (
  <View style={styles.header}>
    <View style={styles.headerLeft}>
      {onVoltar ? (
        <TouchableOpacity style={styles.headerIconButton} onPress={onVoltar} activeOpacity={0.7}>
          <Text style={styles.headerIconText}>‹</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.headerIconButton}>
          <Text style={styles.headerIconText}>🍽️</Text>
        </View>
      )}
      <Text style={styles.headerTitulo}>{titulo}</Text>
    </View>

    <View style={styles.headerAvatar}>
      <Text style={{ fontSize: 18 }}>👤</Text>
    </View>
  </View>
);

const StatusBadge = ({ status }) => (
  <View style={[styles.badge, status === 'aberta' ? styles.badgeOcupada : styles.badgeLivre]}>
    <Text style={[styles.badgeTexto, status === 'aberta' ? styles.badgeTextoOcupada : styles.badgeTextoLivre]}>
      {status === 'aberta' ? 'Ocupada' : 'Livre'}
    </Text>
  </View>
);


// Componente Principal

const App = () => {
  // Chamando a inteligência do App (Adicionado 'cardapio' aqui dentro!)
  const {
    cardapio,
    carregando,
    mesaSelecionada,
    setMesaSelecionada,
    comandaAtiva,
    buscaMesa,
    setBuscaMesa,
    filtroStatus,
    setFiltroStatus,
    buscaCardapio,
    setBuscaCardapio,
    aoClicarNaMesa,
    abrirComanda,
    adicionarItemAoPedido,
    fecharConta,
    mesasFiltradas,
  } = useAppLogic();

  if (carregando) {
    return (
      <View style={styles.containerCentrado}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.textoCarregando}>Conectando ao Cantinho...</Text>
      </View>
    );
  }

 
  // TELA DE DETALHES DA MESA
  
  if (mesaSelecionada) {
    const itensCardapioFiltrados = cardapio.filter((item) =>
      item.nome.toLowerCase().includes(buscaCardapio.toLowerCase())
    );

    return (
      <View style={styles.container}>
        <HeaderBar titulo="Detalhes da Mesa" onVoltar={() => setMesaSelecionada(null)} />

        {mesaSelecionada.status === 'livre' ? (
          <View style={styles.telaLivreWrapper}>
            <View style={styles.boxMesaLivre}>
              <View style={styles.iconeMesaLivreCirculo}>
                <Text style={{ fontSize: 36 }}>🪑</Text>
              </View>
              <Text style={styles.tituloMesaLivre}>Mesa {mesaSelecionada.numero} está livre</Text>
              <Text style={styles.infoTexto}>Deseja abrir uma nova comanda para esta mesa?</Text>
              <TouchableOpacity style={styles.botaoPrimario} onPress={abrirComanda} activeOpacity={0.85}>
                <Text style={styles.textoBotaoPrimario}>＋ Abrir Comanda</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <ScrollView style={styles.scrollDetalhes} showsVerticalScrollIndicator={false}>
              {/* Bento: info da mesa + total da comanda */}
              <View style={styles.bentoWrapper}>
                <View style={styles.cardInfoMesa}>
                  <View style={styles.cardInfoMesaTopo}>
                    <Text style={styles.labelMesa}>Mesa</Text>
                    <StatusBadge status="aberta" />
                  </View>
                  <Text style={styles.numeroMesaGrande}>
                    {String(mesaSelecionada.numero).padStart(2, '0')}
                  </Text>
                  {mesaSelecionada.capacidade ? (
                    <View style={styles.linhaInfoMesa}>
                      <Text style={styles.linhaInfoMesaTexto}>
                        👥 {mesaSelecionada.capacidade} pessoas
                      </Text>
                    </View>
                  ) : null}
                </View>

                <View style={styles.cardTotalComanda}>
                  <Text style={styles.labelTotalComanda}>Total da Comanda</Text>
                  <Text style={styles.valorTotalComanda}>
                    R$ {comandaAtiva ? comandaAtiva.valorTotal.toFixed(2) : '0.00'}
                  </Text>
                  <Text style={styles.qtdItensTexto}>
                    {comandaAtiva?.itens?.length || 0}{' '}
                    {comandaAtiva?.itens?.length === 1 ? 'item adicionado' : 'itens adicionados'}
                  </Text>
                </View>
              </View>

              {/* Menu rápido */}
              <View style={styles.secaoMenuRapido}>
                <View style={styles.secaoMenuRapidoTopo}>
                  <Text style={styles.tituloSecao}>Menu Rápido</Text>
                </View>
                <TextInput
                  style={styles.inputBusca}
                  placeholder="Buscar item..."
                  placeholderTextColor={COLORS.outline}
                  value={buscaCardapio}
                  onChangeText={setBuscaCardapio}
                />

                {itensCardapioFiltrados.length > 0 ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginTop: 14 }}
                  >
                    {itensCardapioFiltrados.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.cardMenuRapido}
                        onPress={() => adicionarItemAoPedido(item)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.iconeMenuRapidoCirculo}>
                          <Text style={{ fontSize: 22 }}>{escolherIcone(item.nome)}</Text>
                        </View>
                        <Text style={styles.nomeMenuRapido} numberOfLines={2}>
                          {item.nome}
                        </Text>
                        <Text style={styles.precoMenuRapido}>R$ {item.preco.toFixed(2)}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                ) : (
                  <Text style={styles.textoVazio}>Nenhum item encontrado.</Text>
                )}
              </View>

              {/* Histórico do pedido */}
              <View style={styles.secaoHistorico}>
                <Text style={styles.tituloSecao}>Histórico do Pedido</Text>
                <View style={styles.boxHistorico}>
                  {comandaAtiva?.itens && comandaAtiva.itens.length > 0 ? (
                    comandaAtiva.itens.map((it, index) => (
                      <View
                        key={it.id}
                        style={[
                          styles.linhaHistorico,
                          index === comandaAtiva.itens.length - 1 && styles.linhaHistoricoSemBorda,
                        ]}
                      >
                        <View style={styles.linhaHistoricoEsquerda}>
                          <View style={styles.iconeHistoricoCirculo}>
                            <Text style={{ fontSize: 18 }}>{escolherIcone(it.itemCardapio.nome)}</Text>
                          </View>
                          <Text style={styles.nomeItemHistorico}>{it.itemCardapio.nome}</Text>
                        </View>
                        <View style={styles.linhaHistoricoDireita}>
                          <View style={styles.qtdBadge}>
                            <Text style={styles.qtdBadgeTexto}>{it.quantidade}x</Text>
                          </View>
                          <Text style={styles.valorItemHistorico}>
                            R$ {(it.itemCardapio.preco * it.quantidade).toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    ))
                  ) : (
                    <Text style={[styles.textoVazio, { padding: 16 }]}>Nenhum item lançado ainda.</Text>
                  )}
                </View>
              </View>

              <View style={{ height: 24 }} />
            </ScrollView>

            <View style={styles.rodapeAcoes}>
              <TouchableOpacity style={styles.botaoFecharConta} onPress={fecharConta} activeOpacity={0.85}>
                <Text style={styles.textoBotaoFecharConta}>🧾 Fechar Conta</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    );
  }


  // TELA PRINCIPAL (Lista de Mesas)

  return (
    <View style={styles.container}>
      <HeaderBar titulo="Cantinho" />

      <Text style={styles.tituloPainel}>Painel de Mesas</Text>
      <Text style={styles.subtituloPainel}>Gerencie o fluxo do salão em tempo real.</Text>

      <TextInput
        style={styles.inputBusca}
        placeholder="Buscar mesa..."
        placeholderTextColor={COLORS.outline}
        value={buscaMesa}
        onChangeText={setBuscaMesa}
        keyboardType="numeric"
      />

      <View style={styles.filtroPillsContainer}>
        {[
          { key: 'todos', label: 'Todos' },
          { key: 'livre', label: 'Livres' },
          { key: 'aberta', label: 'Ocupadas' },
        ].map((opcao) => (
          <TouchableOpacity
            key={opcao.key}
            style={[styles.filtroPill, filtroStatus === opcao.key && styles.filtroPillAtivo]}
            onPress={() => setFiltroStatus(opcao.key)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filtroPillTexto,
                filtroStatus === opcao.key && styles.filtroPillTextoAtivo,
              ]}
            >
              {opcao.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={mesasFiltradas}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.colunaMesas}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <Text style={[styles.textoVazio, { marginTop: 30, textAlign: 'center' }]}>
            Nenhuma mesa encontrada.
          </Text>
        }
        renderItem={({ item }) => {
          const ocupada = item.status === 'aberta';
          const tempoDecorrido = formatarTempoDecorrido(item.abertaEm);
          return (
            <TouchableOpacity
              style={[styles.cardMesa, ocupada ? styles.cardMesaBordaOcupada : styles.cardMesaBordaLivre]}
              onPress={() => aoClicarNaMesa(item)}
              activeOpacity={0.7}
            >
              <View style={styles.cardMesaTopo}>
                <Text style={styles.labelMesa}>Mesa</Text>
                <StatusBadge status={item.status} />
              </View>
              <Text style={styles.numeroMesaGrande}>{String(item.numero).padStart(2, '0')}</Text>

              <View style={styles.cardMesaDivider} />

              {ocupada ? (
                <View style={{ gap: 6 }}>
                  {item.valorTotal != null ? (
                    <View style={styles.linhaCardMesa}>
                      <Text style={styles.linhaCardMesaLabel}>Total atual</Text>
                      <Text style={styles.linhaCardMesaValor}>R$ {item.valorTotal.toFixed(2)}</Text>
                    </View>
                  ) : (
                    <Text style={styles.cardMesaHint}>Comanda em aberto</Text>
                  )}
                  {tempoDecorrido ? (
                    <Text style={styles.cardMesaHintMuted}>🕒 {tempoDecorrido}</Text>
                  ) : null}
                </View>
              ) : (
                <View style={{ gap: 6 }}>
                  <Text style={styles.cardMesaHint}>Aguardando clientes</Text>
                  {item.capacidade ? (
                    <Text style={styles.cardMesaHintMuted}>👥 Capacidade: {item.capacidade} pessoas</Text>
                  ) : null}
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default App;