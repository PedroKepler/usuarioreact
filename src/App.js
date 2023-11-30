import React, { useState, useEffect } from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import logoCadastro from './assets/cadastro.png';

function App() {

  const baseUrl = "https://localhost:7242/api/usuarios";

  const [data, setData] = useState([]);
  const [updateData, setUpdateData] = useState(true);

  const [modalIncluir, setModalIncluir] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);

  const [usuarioSelecionado, setUsuarioSelecionado] = useState({
    id: '',
    nome: '',
    email: '',
    idade: ''
  })

  const selecionarUsuario = (usuario, opcao) => {
    setUsuarioSelecionado(usuario);
    (opcao === "Editar") ?
      abrirFecharModalEditar() : abrirFecharModalExcluir();
  }

  const abrirFecharModalIncluir = () => {
    setModalIncluir(!modalIncluir);
  }

  const abrirFecharModalEditar = () => {
    setModalEditar(!modalEditar);
  }

  const abrirFecharModalExcluir = () => {
    setModalExcluir(!modalExcluir);
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setUsuarioSelecionado({
      ...usuarioSelecionado, [name]: value
    });
    console.log(usuarioSelecionado);
  }

  const pedidoGet = async () => {
    await axios.get(baseUrl)
      .then(response => {
        setData(response.data);
      }).catch(error => {
        console.log(error);
      })
  }

  const pedidoPost = async () => {
    delete usuarioSelecionado.id;
    usuarioSelecionado.idade = parseInt(usuarioSelecionado.idade);
    await axios.post(baseUrl, usuarioSelecionado)
      .then(response => {
        setData(data.concat(response.data));
        setUpdateData(true);
        abrirFecharModalIncluir();
      }).catch(error => {
        console.log(error);
      })
  }

  const pedidoPut = async () => {
    usuarioSelecionado.idade = parseInt(usuarioSelecionado.idade);
    await axios.put(baseUrl + "/" + usuarioSelecionado.id, usuarioSelecionado)
      .then(response => {
        var resposta = response.data;
        var dadosAuxiliar = data;
        dadosAuxiliar.map(usuario => {
          if (usuario.id === usuarioSelecionado.id) {
            usuario.nome = resposta.nome;
            usuario.email = resposta.email;
            usuario.idade = resposta.idade;
          }
        });
        setUpdateData(true);
        abrirFecharModalEditar();
      }).catch(error => {
        console.log(error);
      })
  }

  const pedidoDelete = async () => {
    await axios.delete(baseUrl + "/" + usuarioSelecionado.id)
      .then(response => {
        setData(data.filter(usuario => usuario.id !== response.data));
        setUpdateData(true);
        abrirFecharModalExcluir();
      }).catch(error => {
        console.log(error);
      })
  }

  useEffect(() => {
    if (updateData) {
      pedidoGet();
      setUpdateData(false);
    }
  }, [updateData])

  return (
    <div className="usuario-container">
      <br />
      <h3>Cadastro de Usuários</h3>
      <header>
        <img src={logoCadastro} alt='Cadastro' />
        <button className="btn btn-success" onClick={() => abrirFecharModalIncluir()}>Incluir Novo Usuário</button>
      </header>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Idade</th>
            <th>Operação</th>
          </tr>
        </thead>
        <tbody>
          {data.map(usuario => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nome}</td>
              <td>{usuario.email}</td>
              <td>{usuario.idade}</td>
              <td>
                <button className="btn btn-primary" onClick={() => selecionarUsuario(usuario, "Editar")}>Editar</button> {"  "}
                <button className="btn btn-danger" onClick={() => selecionarUsuario(usuario, "Excluir")}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalIncluir}>
        <ModalHeader>Incluir Usuários</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nome: </label>
            <br />
            <input type="text" className="form-control" name="nome" onChange={handleChange} />
            <br />
            <label>Email: </label>
            <br />
            <input type="text" className="form-control" name="email" onChange={handleChange} />
            <br />
            <label>Idade: </label>
            <br />
            <input type="text" className="form-control" name="idade" onChange={handleChange} />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => pedidoPost()}>Incluir</button>{"   "}
          <button className="btn btn-danger" onClick={() => abrirFecharModalIncluir()} >Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Usuário</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>ID: </label>
            <input type="text" className="form-control" readOnly
              value={usuarioSelecionado && usuarioSelecionado.id} />
            <br />
            <label>Nome: </label><br />
            <input type="text" className="form-control" name="nome" onChange={handleChange}
              value={usuarioSelecionado && usuarioSelecionado.nome} /><br />
            <label>Email: </label><br />
            <input type="text" className="form-control" name="email" onChange={handleChange}
              value={usuarioSelecionado && usuarioSelecionado.email} /><br />
            <label>Idade: </label><br />
            <input type="text" className="form-control" name="idade" onChange={handleChange}
              value={usuarioSelecionado && usuarioSelecionado.idade} /><br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => pedidoPut()}>Editar</button>{"  "}
          <button className="btn btn-danger" onClick={() => abrirFecharModalEditar()} >Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalExcluir}>
        <ModalBody>
          Confirma a exclusão deste(a)usuário (a) : {usuarioSelecionado && usuarioSelecionado.nome} ?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={() => pedidoDelete()} > Sim </button>
          <button className="btn btn-secondary" onClick={() => abrirFecharModalExcluir()}> Não </button>
        </ModalFooter>
      </Modal>

    </div>
  );
}

export default App;
