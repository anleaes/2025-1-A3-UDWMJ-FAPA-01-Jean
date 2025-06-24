<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="row items-center justify-between q-mb-md">
        <div class="text-h5">Clientes Cadastrados</div>
        <q-btn label="Novo Cliente" color="primary" icon="add" @click="abrirFormulario()" />
      </div>

      <q-table
        :rows="clientes"
        :columns="colunas"
        row-key="id"
        flat
        bordered
        :loading="carregando"
        no-data-label="Nenhum cliente encontrado."
      >
        <template v-slot:body-cell-acoes="props">
          <q-td align="right">
            <q-btn flat icon="edit" color="primary" size="sm" @click="abrirFormulario(props.row)" />
            <q-btn flat icon="delete" color="negative" size="sm" @click="excluirCliente(props.row.id)" />
          </q-td>
        </template>
      </q-table>

      <q-dialog v-model="formVisivel">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ editarModo ? 'Editar Cliente' : 'Cadastro de Cliente' }}</div>
          </q-card-section>

          <q-card-section>
            <q-input v-model="novoCliente.nome" label="Nome" filled class="q-mb-sm" />
            <q-input v-model="novoCliente.email" label="E-mail" filled class="q-mb-sm" />
            <q-input v-model="novoCliente.telefone" label="Telefone" filled />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="primary" v-close-popup />
            <q-btn label="Salvar" color="primary" @click="salvarCliente" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ClientesPage',
  data() {
    return {
      clientes: [],
      carregando: false,
      formVisivel: false,
      editarModo: false,
      novoCliente: {
        nome: '',
        email: '',
        telefone: ''
      },
      colunas: [
        { name: 'id', label: 'ID', field: 'id', align: 'left' },
        { name: 'nome', label: 'Nome', field: 'nome', align: 'left' },
        { name: 'email', label: 'E-mail', field: 'email', align: 'left' },
        { name: 'telefone', label: 'Telefone', field: 'telefone', align: 'left' },
        { name: 'acoes', label: 'Ações', field: 'acoes', align: 'right' }
      ]
    }
  },
  mounted() {
    const logado = localStorage.getItem('usuarioLogado')
    if (logado !== 'true') {
      this.$router.replace('/login')
      return
    }

    this.buscarClientes()
  },
  methods: {
    async buscarClientes() {
      this.carregando = true
      try {
        const res = await axios.get('http://localhost:3000/clientes')
        this.clientes = res.data
      } catch (erro) {
        console.error('Erro ao buscar clientes:', erro)
      } finally {
        this.carregando = false
      }
    },
    abrirFormulario(cliente = null) {
      this.editarModo = !!cliente
      this.novoCliente = cliente ? { ...cliente } : { nome: '', email: '', telefone: '' }
      this.formVisivel = true
    },
    async salvarCliente() {
      const dados = {
        nome: this.novoCliente.nome,
        email: this.novoCliente.email,
        telefone: this.novoCliente.telefone
      }

      try {
        if (this.editarModo && this.novoCliente.id) {
          await axios.put(`http://localhost:3000/clientes/${this.novoCliente.id}`, dados)
        } else {
          await axios.post('http://localhost:3000/clientes', dados)
        }
        this.formVisivel = false
        this.buscarClientes()
      } catch (erro) {
        console.error('Erro ao salvar cliente:', erro)
      }
    },
    async excluirCliente(id) {
      const confirmar = confirm('Tem certeza que deseja excluir este cliente?')
      if (!confirmar) return

      try {
        await axios.delete(`http://localhost:3000/clientes/${id}`)
        this.buscarClientes()
      } catch (erro) {
        console.error('Erro ao excluir cliente:', erro)
      }
    }
  }
}
</script>
