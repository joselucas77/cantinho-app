import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import api from '../../api'; // Sobe duas pastas para achar o api.js na raiz

const useAppLogic = () => {
  // ESTADOS (Movidos do App.js)
  const [mesas, setMesas] = useState([]);
  const [cardapio, setCardapio] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mesaSelecionada, setMesaSelecionada] = useState(null);
  const [comandaAtiva, setComandaAtiva] = useState(null);
  const [buscaMesa, setBuscaMesa] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [buscaCardapio, setBuscaCardapio] = useState('');



  // CARREGAMENTO INICIAL
  const inicializarApp = async () => {
    try {
      const resMesas = await api.get('/mesas');
      const resCardapio = await api.get('/cardapio');
      setMesas(resMesas.data);
      setCardapio(resCardapio.data);
    } catch (error) {
      console.error('Erro ao inicializar:', error);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    inicializarApp();
  }, []);



  // FUNÇÕES DE AÇÃO
  const atualizarDetalhesComanda = async (mesaId) => {
    try {
      const resposta = await api.get(`/mesas/${mesaId}/comanda-ativa`);
      setComandaAtiva(resposta.data);
    } catch (error) {
      setComandaAtiva(null);
    }
  };

  const aoClicarNaMesa = async (mesa) => {
    setMesaSelecionada(mesa);
    setBuscaCardapio('');
    if (mesa.status === 'aberta') {
      await atualizarDetalhesComanda(mesa.id);
    } else {
      setComandaAtiva(null);
    }
  };

  const abrirComanda = async () => {
    try {
      await api.post('/comandas', { mesaId: mesaSelecionada.id });
      Alert.alert('Sucesso', `Mesa ${mesaSelecionada.numero} aberta!`);
      const mesaAtualizada = { ...mesaSelecionada, status: 'aberta' };
      setMesaSelecionada(mesaAtualizada);
      inicializarApp();
      await atualizarDetalhesComanda(mesaAtualizada.id);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir a comanda.');
    }
  };

  const adicionarItemAoPedido = async (item) => {
    if (!comandaAtiva) return;
    try {
      await api.post(`/comandas/${comandaAtiva.id}/itens`, {
        itemCardapioId: item.id,
        quantidade: 1,
        observacao: '',
      });
      await atualizarDetalhesComanda(mesaSelecionada.id);
      inicializarApp();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar o item.');
    }
  };

  const fecharConta = async () => {
    if (!comandaAtiva) return;
    Alert.alert('Fechar conta', 'Confirma o fechamento e liberação da mesa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Fechar conta',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.put(`/comandas/${comandaAtiva.id}/fechar`);
            Alert.alert('Sucesso', 'Conta fechada e mesa liberada!');
            setMesaSelecionada(null);
            setComandaAtiva(null);
            inicializarApp();
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível fechar a conta.');
          }
        },
      },
    ]);
  };

  

  // LÓGICA DE FILTRAGEM (Calculada aqui dentro agora)
  const mesasFiltradas = mesas.filter((mesa) => {
    const passaBusca = buscaMesa.trim() === '' || String(mesa.numero).includes(buscaMesa.trim());
    const passaStatus =
      filtroStatus === 'todos' ||
      (filtroStatus === 'livre' && mesa.status !== 'aberta') ||
      (filtroStatus === 'aberta' && mesa.status === 'aberta');
    return passaBusca && passaStatus;
  });

  // 📦 O GRANDE SEGREDO: Exportar tudo o que a tela vai precisar usar
  return {
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
  };
};

export default useAppLogic;