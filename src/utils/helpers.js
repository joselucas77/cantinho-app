// Helpers  // funções de Helpers (Ajudantes). Elas servem para resolver pequenos problemas de lógica repetitiva e deixar o resto do código limpo.

// Escolhe um emoji de acordo com o nome do prato
export const escolherIcone = (nomeOriginal = '') => {
  const nome = nomeOriginal.toLowerCase();
  if (nome.includes('cerveja') || nome.includes('chopp')) return '🍺';
  if (nome.includes('caipirinha') || nome.includes('drink') || nome.includes('dose')) return '🍹';
  if (nome.includes('água') || nome.includes('agua') || nome.includes('suco') || nome.includes('refrigerante')) return '🥤';
  if (nome.includes('sobremesa') || nome.includes('doce') || nome.includes('sorvete')) return '🍨';
  if (nome.includes('salada')) return '🥗';
  if (nome.includes('picanha') || nome.includes('carne') || nome.includes('churrasco')) return '🥩';
  if (nome.includes('frango')) return '🍗';
  if (nome.includes('peixe') || nome.includes('camarão') || nome.includes('camarao')) return '🐟';
  if (nome.includes('pizza')) return '🍕';
  return '🍽️';
};



// Calcula "X min atrás" a partir de uma data ISO (só usado se a API
// algum dia passar a mandar esse campo)
export const formatarTempoDecorrido = (isoDate) => {
  if (!isoDate) 
    return null;

  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutos = Math.floor(diffMs / 60000);

  if (minutos < 1) 
    return 'agora mesmo';

  if (minutos < 60) 
    return `${minutos} min atrás`;

  const horas = Math.floor(minutos / 60);
  const restoMin = minutos % 60;
  return `${horas}h ${restoMin}min atrás`;
};

