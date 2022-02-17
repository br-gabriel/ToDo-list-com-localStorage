/*localStorage só armazena arquivos em string, então é necessário 
converter os dados em string por meio do comando 'JSON.stringify(dataBase)'.
Para receber os dados em formato JSON, devemos utilizar o comando 
'JSON.parse(localStorage.getItem('todoList'))'*/

'use strict';

//Função que armazena temporariamente os dados do localStorage
let dataBase = [];

//Função que recebe os dados armazenados no localStorage
const getBanco = () => JSON.parse(localStorage.getItem('todoList')) ?? [];
//?? = Se estiver nulo, recebe um array vazio

//Função que envia os dados para o localStorage
const setDados = (dataBase) => localStorage.setItem('todoList', JSON.stringify(dataBase))

const criarItem = (tarefa, status, indice) => {
    //Cria um label em HTML
    const item = document.createElement('label');

    //Adiciona a classe 'todo_item' no item criado
    item.classList.add('todo_item');

    //Atualiza o conteúdo HTML dentro do item criado, utilizando template string
    item.innerHTML = `
    <input type="checkbox" ${status} data-indice=${indice}>
    <div>${tarefa}</div>
    <input type="button" value="X" data-indice=${indice}>`

    //Adiciona o item criado dentro da tag com ID 'listaDeTarefas'
    document.getElementById('listaDeTarefas').appendChild(item);
}

//Função que impede a duplicação de itens caso a função atualizarTela seja acionada
const limparTarefas = () => {
    const listaDeTarefas = document.getElementById('listaDeTarefas');
    //Caso a listaDeTarefas tenha o primeiro filho, a função remove os itens até o primeiro item duplicado
    while (listaDeTarefas.firstChild) {
        listaDeTarefas.removeChild(listaDeTarefas.lastChild)
    }
}

const atualizarTela = () => {
    //Impede que os itens se dupliquem ao atualizar a tela
    limparTarefas();

    const dataBase = getBanco();

    //Envia somente os valores para a função criarItem
    dataBase.forEach((item, indice) => criarItem(item.tarefa, item.status, indice));
}

const inserirItem = (evento) => {
    //Tecla pressionada que acionou o evento
    const tecla = evento.key;
    //Texto adicionado em 'novaTarefa' ao ser acionado o evento
    const texto = evento.target.value;

    if (tecla === 'Enter' && texto !== '') {
        //Recebe o banco de dados
        const dataBase = getBanco();
        //Adiciona a tarefa com o status sem o 'checked'
        dataBase.push ({'tarefa' : texto, 'status' : ''});
        //Envia para o banco de dados
        setDados(dataBase);
    
        atualizarTela();

        //Limpa o texto dentro do input 'novaTarefa'
        evento.target.value = '';
    }
}

const removerItem = (indice) => {
    //Recebe os dados do banco de dados
    const dataBase = getBanco();
    //Remove o item selecionado por meio do splice, passando 1 item como parâmetro
    dataBase.splice(indice, 1);
    //Envia a atualização para o banco de dados
    setDados(dataBase);
    //Atualiza a tela com a alteração dos dados
    atualizarTela();
}

const atualizarItem = (indice) => {
    //Recebe os dados do banco de dados
    const dataBase = getBanco();
    //Verifica o status, se for vazio, troca para 'checked' se estiver 'checked' troca para vazio
    dataBase[indice].status = dataBase[indice].status === '' ? 'checked' : '';
    //Envia a atualização para o banco de dados
    setDados(dataBase);
    //Atualiza a tela com a alteração dos dados
    atualizarTela();
}

const clickItem = (evento) => {
    //Seleciona o alvo que acionou o evento
    const elemento = evento.target;

    /*Se o alvo que acionou o evento for um botão, então seleciona o item acionado,
    por meio do indice e o remove*/
    if (elemento.type === 'button') {
        const indice = elemento.dataset.indice
        removerItem(indice);
    } else if (elemento.type === 'checkbox') {
        const indice = elemento.dataset.indice;
        atualizarItem(indice);
    }
    /*Se o evento foi acionado por um checkbox, o item acionado é atualizado no DB*/
}

const botaoInserirItem = () => {
    //Capturar o texto do input
    const inputNovaTarefa = document.getElementById('novaTarefa');
    let texto = inputNovaTarefa.value;
    
    if (texto !== '') {
        //Recebe o banco de dados
        const dataBase = getBanco();
        //Adiciona a tarefa com o status sem o 'checked'
        dataBase.push ({'tarefa' : texto, 'status' : ''});
        //Envia para o banco de dados
        setDados(dataBase);
    
        atualizarTela();

        //Limpa o valor do input para adicionar uma nova tarefa
        inputNovaTarefa.value = '';
    }
}

//Adição de eventos
document.getElementById('novaTarefa').addEventListener('keypress', inserirItem);
document.getElementById('listaDeTarefas').addEventListener('click', clickItem);
document.getElementById('addTarefa').addEventListener('click', botaoInserirItem);

atualizarTela();