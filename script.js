// Dias da semana e meses do ano
const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

// Seletores do DOM
const selectAno = document.getElementById('selectAno');
const selectMes = document.getElementById('selectMes');
const selectSemana = document.getElementById('selectSemana');
const agendaContainer = document.getElementById('agendaContainer');
const contadorDiv = document.getElementById('contadorCliques');
const limparBtn = document.getElementById('limparTarefasBtn');
const temaToggleBtn = document.getElementById('temaToggleBtn');
const temaPinkBtn = document.getElementById('temaPinkBtn');

// Recupera o número de tarefas adicionadas do localStorage ou inicia com 0
let contadorCliques = parseInt(localStorage.getItem('contadorCliques')) || 0;
contadorDiv.textContent = `Tarefas adicionadas: ${contadorCliques}`;

// Preenche selects de ano, mês e semana
function popularSelects() {
  const anoAtual = new Date().getFullYear();
  for(let i = anoAtual - 5; i <= anoAtual + 5; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    if(i === anoAtual) option.selected = true;
    selectAno.appendChild(option);
  }

  meses.forEach((mes, idx) => {
    const option = document.createElement('option');
    option.value = idx;
    option.textContent = mes;
    if(idx === new Date().getMonth()) option.selected = true;
    selectMes.appendChild(option);
  });

  // Para semanas, vamos supor 1 a 5
  for(let i = 1; i <= 5; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `Semana ${i}`;
    if(i === 1) option.selected = true;
    selectSemana.appendChild(option);
  }
}

// Calcula as datas dos dias da semana selecionada
function obterDatasDaSemana(ano, mes, semana) {
  // Pega o primeiro dia do mês
  const primeiroDiaMes = new Date(ano, mes, 1);
  // Dia da semana do primeiro dia do mês (0 a 6)
  const diaSemanaPrimeiroDiaMes = primeiroDiaMes.getDay();
  
  // Calcular o primeiro domingo da semana escolhida
  // Começa com 1 + (semana - 1)*7 - diaSemanaPrimeiroDiaMes
  // Para ter o domingo da semana que começa a contar no domingo
  const diaInicial = 1 + (semana - 1) * 7 - diaSemanaPrimeiroDiaMes;

  // Array de datas para cada dia da semana (domingo a sábado)
  let datasSemana = [];

  for(let i = 0; i < 7; i++) {
    const dia = new Date(ano, mes, diaInicial + i);
    datasSemana.push(dia);
  }
  return datasSemana;
}

// Função para criar a agenda na tela
function criarAgenda() {
  agendaContainer.innerHTML = ''; // Limpa antes

  const ano = parseInt(selectAno.value);
  const mes = parseInt(selectMes.value);
  const semana = parseInt(selectSemana.value);

  const datas = obterDatasDaSemana(ano, mes, semana);

  datas.forEach(diaData => {
    const diaDiv = document.createElement('div');
    diaDiv.className = 'dia';

    const tituloDia = document.createElement('h2');
    tituloDia.textContent = `${dias[diaData.getDay()]}, ${diaData.getDate()}/${diaData.getMonth() + 1}`;

    const listaTarefas = document.createElement('ul');
    listaTarefas.id = `tarefas-${diaData.toISOString().slice(0,10)}`;

    // Carregar tarefas salvas para esse dia
    const tarefasSalvas = JSON.parse(localStorage.getItem(listaTarefas.id)) || [];
    tarefasSalvas.forEach(tarefaObj => {
      const li = criarTarefaElemento(tarefaObj.texto, tarefaObj.concluida, listaTarefas.id);
      listaTarefas.appendChild(li);
    });

    // Input e botão para adicionar tarefa
    const inputTarefa = document.createElement('input');
    inputTarefa.type = 'text';
    inputTarefa.className = 'tarefa-input';
    inputTarefa.placeholder = 'Nova tarefa';

    const btnAdicionar = document.createElement('button');
    btnAdicionar.textContent = 'Adicionar';

    btnAdicionar.addEventListener('click', () => {
      const texto = inputTarefa.value.trim();
      if(texto === '') return;
      const li = criarTarefaElemento(texto, false, listaTarefas.id);
      listaTarefas.appendChild(li);
      salvarTarefas(listaTarefas.id);
      inputTarefa.value = '';

      // Atualiza contador
      contadorCliques++;
      contadorDiv.textContent = `Tarefas adicionadas: ${contadorCliques}`;
      localStorage.setItem('contadorCliques', contadorCliques);
    });

    diaDiv.appendChild(tituloDia);
    diaDiv.appendChild(listaTarefas);
    diaDiv.appendChild(inputTarefa);
    diaDiv.appendChild(btnAdicionar);

    agendaContainer.appendChild(diaDiv);
  });
}

// Cria o elemento li da tarefa com checkbox
function criarTarefaElemento(texto, concluida, listaId) {
  const li = document.createElement('li');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = concluida;

  checkbox.addEventListener('change', () => {
    salvarTarefas(listaId);
  });

  const span = document.createElement('span');
  span.textContent = texto;

  li.appendChild(checkbox);
  li.appendChild(span);

  return li;
}

// Salva tarefas no localStorage
function salvarTarefas(listaId) {
  const lista = document.getElementById(listaId);
  if(!lista) return;

  const tarefas = [];
  lista.querySelectorAll('li').forEach(li => {
    tarefas.push({
      texto: li.querySelector('span').textContent,
      concluida: li.querySelector('input[type="checkbox"]').checked
    });
  });

  localStorage.setItem(listaId, JSON.stringify(tarefas));
}

// Limpa todas as tarefas da agenda e localStorage
limparBtn.addEventListener('click', () => {
  if(confirm('Tem certeza que deseja limpar todas as tarefas?')) {
    // Remove todas as tarefas do localStorage para as semanas exibidas
    const ano = parseInt(selectAno.value);
    const mes = parseInt(selectMes.value);
    const semana = parseInt(selectSemana.value);
    const datas = obterDatasDaSemana(ano, mes, semana);

    datas.forEach(diaData => {
      const key = `tarefas-${diaData.toISOString().slice(0,10)}`;
      localStorage.removeItem(key);
    });

    contadorCliques = 0;
    localStorage.setItem('contadorCliques', contadorCliques);
    contadorDiv.textContent = `Tarefas adicionadas: ${contadorCliques}`;

    criarAgenda();
  }
});

// Alternar modo claro/escuro
temaToggleBtn.addEventListener('click', () => {
  const body = document.body;
  if(body.classList.contains('dark-mode')) {
    body.classList.remove('dark-mode');
    temaToggleBtn.textContent = 'Modo Escuro';
  } else {
    body.classList.remove('pink-mode');
    body.classList.add('dark-mode');
    temaToggleBtn.textContent = 'Modo Claro';
  }
});

// Alternar modo pink
temaPinkBtn.addEventListener('click', () => {
  const body = document.body;
  if(body.classList.contains('pink-mode')) {
    body.classList.remove('pink-mode');
    temaPinkBtn.textContent = 'Modo Pink';
  } else {
    body.classList.remove('dark-mode');
    body.classList.add('pink-mode');
    temaPinkBtn.textContent = 'Modo Claro';
  }
});

// Atualizar agenda quando muda o select
selectAno.addEventListener('change', criarAgenda);
selectMes.addEventListener('change', criarAgenda);
selectSemana.addEventListener('change', criarAgenda);

// Inicialização
popularSelects();
criarAgenda();
