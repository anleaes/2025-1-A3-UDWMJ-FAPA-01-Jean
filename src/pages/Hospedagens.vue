<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="row items-center justify-between q-mb-md">
        <div class="text-h5">Hospedagens Cadastradas</div>
        <q-btn label="Nova Hospedagem" color="primary" icon="add" @click="abrirFormulario()" />
      </div>

      <q-table
        :rows="hospedagens"
        :columns="colunas"
        row-key="id"
        flat
        bordered
        :loading="carregando"
        no-data-label="Nenhuma hospedagem encontrada."
      >
        <template v-slot:body-cell-acoes="props">
          <q-td align="right">
            <q-btn flat icon="edit" color="primary" size="sm" @click="abrirFormulario(props.row)" />
            <q-btn flat icon="delete" color="negative" size="sm" @click="excluirHospedagem(props.row.id)" />
          </q-td>
        </template>
      </q-table>

      <q-dialog v-model="formVisivel">
        <q-card>
          <q-card-section>
            <div class="text-h6">
              {{ editarModo ? 'Editar Hospedagem' : 'Cadastro de Hospedagem' }}
            </div>
          </q-card-section>

          <q-card-section>
            <q-input v-model="novaHospedagem.nome" label="Nome" filled class="q-mb-sm" />
            <q-input v-model="novaHospedagem.cidade" label="Cidade" filled class="q-mb-sm" />
            <q-input v-model.number="novaHospedagem.diaria" label="Valor da diária" type="number" filled class="q-mb-sm" />
            <q-input v-model="novaHospedagem.tipo" label="Tipo (Casa, Hotel, etc)" filled class="q-mb-sm" />
            <q-input v-model.number="novaHospedagem.quartos" label="Quantidade de quartos" type="number" filled />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="primary" v-close-popup />
            <q-btn label="Salvar" color="primary" @click="salvarHospedagem" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import axios from 'axios'

export default {
  name: 'HospedagensPage',
  data() {
    return {
      hospedagens: [],
      carregando: false,
      formVisivel: false,
      editarModo: false,
      novaHospedagem: {
        nome: '',
        cidade: '',
        diaria: null,
        tipo: '',
        quartos: null
      },
      colunas: [
        { name: 'id', label: 'ID', field: 'id', align: 'left' },
        { name: 'nome', label: 'Nome', field: 'nome', align: 'left' },
        { name: 'cidade', label: 'Cidade', field: 'cidade', align: 'left' },
        { name: 'diaria', label: 'Diária', field: 'diaria', align: 'left' },
        { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' },
        { name: 'quartos', label: 'Quartos', field: 'quartos', align: 'left' },
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

    this.buscarHospedagens()
  },
  methods: {
    async buscarHospedagens() {
      this.carregando = true
      try {
        const resposta = await axios.get('http://localhost:3000/hospedagens')
        this.hospedagens = resposta.data
      } catch (erro) {
        console.error('Erro ao buscar hospedagens:', erro)
      } finally {
        this.carregando = false
      }
    },
    abrirFormulario(hospedagem = null) {
      if (hospedagem) {
        this.editarModo = true
        this.novaHospedagem = { ...hospedagem }
      } else {
        this.editarModo = false
        this.novaHospedagem = {
          nome: '',
          cidade: '',
          diaria: null,
          tipo: '',
          quartos: null
        }
      }
      this.formVisivel = true
    },
    async salvarHospedagem() {
      try {
        const dados = {
          nome: this.novaHospedagem.nome,
          cidade: this.novaHospedagem.cidade,
          diaria: this.novaHospedagem.diaria,
          tipo: this.novaHospedagem.tipo,
          quartos: this.novaHospedagem.quartos
        }

        if (this.editarModo && this.novaHospedagem.id) {
          await axios.put(`http://localhost:3000/hospedagens/${this.novaHospedagem.id}`, dados)
        } else {
          await axios.post('http://localhost:3000/hospedagens', dados)
        }

        this.formVisivel = false
        this.buscarHospedagens()
      } catch (erro) {
        console.error('Erro ao salvar hospedagem:', erro)
      }
    },
    async excluirHospedagem(id) {
      const confirmar = confirm('Tem certeza que deseja excluir esta hospedagem?')
      if (!confirmar) return

      try {
        await axios.delete(`http://localhost:3000/hospedagens/${id}`)
        this.buscarHospedagens()
      } catch (erro) {
        console.error('Erro ao excluir hospedagem:', erro)
      }
    }
  }
}
</script>
