'use strict'

const openModal = () => document.getElementById('modal').classList.add('active');

const closeModal = () => {
    clearFields();
    document.getElementById('modal').classList.remove('active');
}

//CRUD---------------------------------------------------------------------------------------------------------
const setLocalStorage = (dbItem) => localStorage.setItem('db', JSON.stringify(dbItem));
const getLocalStorage = () => JSON.parse(localStorage.getItem('db')) ?? [];

//CREATE
const creatItem = (item) => {
    const dbItem = getLocalStorage();
    dbItem.push(item);
    setLocalStorage(dbItem);
};

//READ
const readItem = () => getLocalStorage();

//UPDATE
const updateItem = (index, item) => {
    const dbItem = readItem();
    dbItem[index] = item;
    setLocalStorage(dbItem)
};

//DELETE
const deleteItem = (index) => {
    const dbItem = readItem();
    dbItem.splice(index, 1);
    setLocalStorage(dbItem);
    updateTable();
}

const isValidsFields = () => {
    return document.getElementById('form').reportValidity();
}

const clearFields = () => {
    const campos = document.querySelectorAll('.modal-field');
    campos.forEach(campo => campo.value = '');
}

const saveClient = () => {
    if (isValidsFields()) {
        const item = {
            item: document.getElementById('nomeItem').value,
            marca: document.getElementById('marcaItem').value,
            modelo: document.getElementById('modeloItem').value,
            referencia: document.getElementById('referenciaItem').value,
            descricao: document.getElementById('descricaoItem').value,
            patrimonio: (Math.random() * 100000).toFixed(0),
            situacao: document.getElementById('situacaoItem').value,
            data: new Date().toLocaleDateString()
        }

        const index = document.getElementById('nomeItem').dataset.index;

        if (index == 'new') {
            creatItem(item);
            updateTable();
            closeModal();
            Toastify({
                text: "Item cadastrado com sucesso!",
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "center", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: "linear-gradient(to right, rgb(0, 149, 0), rgb(38, 132, 38))",
                },
                onClick: function(){} // Callback after click
              }).showToast();
        } else {
            updateItem(index, item);
            updateTable();
            closeModal();
            Toastify({
                text: "Item alterado com sucesso!",
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "center", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: "linear-gradient(to right, #b09b00, #c9b43d)",
                },
                onClick: function(){} // Callback after click
              }).showToast();
        }
    }
}


const createRow = (item, index) => {
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${item.item}</td>
        <td>${item.marca}</td>
        <td>${item.modelo}</td>
        <td>${item.referencia}</td>
        <td>${item.descricao}</td>
        <td>
            <img id="barcode${index}"></img>
        </td>
        <td>${item.situacao}</td>
        <td>${item.data}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">editar</button>
            <button type="button" class="button red" id="delete-${index}">excluir</button>
        </td>
    `
    document.querySelector('#tableItem>tbody').appendChild(newRow);
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableItem>tbody tr');
    rows.forEach(row => row.parentNode.removeChild(row));
}

const barCode = (item, index) => {
    const barCode = "#barcode" + index;
    JsBarcode(barCode, item.patrimonio, {
        height: 15
    });
}

const updateTable = () => {
    const dbItem = readItem();
    clearTable();
    dbItem.forEach(createRow);
    dbItem.forEach(barCode);
}

const editItem = (index) => {
    const item = readItem()[index];
    item.index = index;
    fillFields(item);
    openModal();
}

const fillFields = (item) => {
    document.getElementById('nomeItem').value = item.item;
    document.getElementById('marcaItem').value = item.marca;
    document.getElementById('modeloItem').value = item.modelo;
    document.getElementById('referenciaItem').value = item.referencia;
    document.getElementById('descricaoItem').value = item.descricao;
    document.getElementById('situacaoItem').value = item.situacao;
    document.getElementById('nomeItem').dataset.index = item.index;
}

const editDelete = (event) => {
    if (event.target.type == 'button') {
        const [action, index] = event.target.id.split('-');

        if (action == 'edit') {
            editItem(index);
        } else {
            const item = readItem()[index];
            Swal.fire({
                title: `Você deseja excluir o item ${item.item}?`,
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Sim",
                denyButtonText: "Não"
              }).then((result) => {
                if (result.isConfirmed) {
                    deleteItem(index);
                    Toastify({
                        text: "Item excluído com sucesso!",
                        duration: 3000,
                        newWindow: true,
                        close: true,
                        gravity: "top", // `top` or `bottom`
                        position: "center", // `left`, `center` or `right`
                        stopOnFocus: true, // Prevents dismissing of toast on hover
                        style: {
                        background: "linear-gradient(to right, #b00000, #c93d3d)",
                        },
                        onClick: function(){} // Callback after click
                    }).showToast();
                } else if (result.isDenied) {
                  Swal.fire("Item não excluído", "", "info");
                }
              });
        }
    }
}

updateTable();

//Eventos modal
document.getElementById('cadastrarItem').addEventListener('click', openModal);

document.getElementById('modalClose').addEventListener('click', closeModal);

document.getElementById('salvar').addEventListener('click', saveClient);

document.getElementById('cancelar').addEventListener('click', closeModal);

document.querySelector('#tableItem>tbody').addEventListener('click', editDelete);