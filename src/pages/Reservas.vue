<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="row items-center justify-between q-mb-md">
        <div class="text-h5">Reservas</div>
        <q-btn label="Nova Reserva" color="primary" icon="add" @click="abrirFormulario()" />
      </div>

      <q-table
        :rows="reservasFormatadas"
        :columns="colunas"
        row-key="id"
        flat
        bordered
        :loading="carregando"
        no-data-label="Nenhuma reserva cadastrada."
      >
        <template v-slot:body-cell-acoes="props">
          <q-td align="right">
            <q-btn flat icon="edit" color="primary" size="sm" @click="abrirFormulario(props.row.original)" />
            <q-btn flat icon="delete" color="negative" size="sm" @click="excluirReserva(props.row.id)" />
          </q-td>
        </template>
      </q-table>

      <q-dialog v-model="formVisivel">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ editarModo ? 'Editar Reserva' : 'Nova Reserva' }}</div>
          </q-card-section>

          <q-card-section>
            <q-select
              filled
              v-model="novaReserva.clienteId"
              :options="clientes.map(c => ({ label: c.nome, value: c.id }))"
              label="Cliente"
              emit-value
              map-options
              class="q-mb-sm"
            />
            <q-select
              filled
              v-model="novaReserva.hospedagemId"
              :options="hospedagens.map(h => ({ label: h.nome, value: h.id }))"
              label="Hospedagem"
              emit-value
              map-options
              class="q-mb-sm"
            />
            <q-input v-model="novaReserva.dataEntrada" type="date" label="Data de Entrada" filled class="q-mb-sm" />
            <q-input v-model="novaReserva.dataSaida" type="date" label="Data de Saída" filled class="q-mb-sm" />
            <q-input v-model.number="novaReserva.hospedes" type="number" label="Nº de Hóspedes" filled />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="primary" v-close-popup />
            <q-btn label="Salvar" color="primary" @click="salvarReserva" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ReservasPage',
  data() {
    return {
      reservas: [],
      hospedagens: [],
      clientes: [],
      carregando: false,
      formVisivel: false,
      editarModo: false,
      novaReserva: {
        clienteId: null,
        hospedagemId: null,
        dataEntrada: '',
        dataSaida: '',
        hospedes: null
      },
      colunas: [
        { name: 'id', label: 'ID', field: 'id', align: 'left' },
        { name: 'cliente', label: 'Cliente', field: 'cliente', align: 'left' },
        { name: 'hospedagem', label: 'Hospedagem', field: 'hospedagem', align: 'left' },
        { name: 'dataEntrada', label: 'Entrada', field: 'dataEntrada', align: 'left' },
        { name: 'dataSaida', label: 'Saída', field: 'dataSaida', align: 'left' },
        { name: 'hospedes', label: 'Hóspedes', field: 'hospedes', align: 'left' },
        { name: 'acoes', label: 'Ações', field: 'acoes', align: 'right' }
      ]
    }
  },
  computed: {
    reservasFormatadas() {
      return this.reservas.map(res => ({
        ...res,
        cliente: this.clientes.find(c => c.id === res.clienteId)?.nome || 'Desconhecido',
        hospedagem: this.hospedagens.find(h => h.id === res.hospedagemId)?.nome || 'Desconhecida',
        original: res
      }))
    }
  },
  mounted() {
    const logado = localStorage.getItem('usuarioLogado')
    if (logado !== 'true') {
      this.$router.replace('/login')
      return
    }
    this.carregarTudo()
  },
  methods: {
    async carregarTudo() {
      this.carregando = true
      try {
        const [res1, res2, res3] = await Promise.all([
          axios.get('http://localhost:3000/reservas'),
          axios.get('http://localhost:3000/clientes'),
          axios.get('http://localhost:3000/hospedagens')
        ])
        this.reservas = res1.data
        this.clientes = res2.data
        this.hospedagens = res3.data
      } catch (e) {
        console.error('Erro ao carregar dados:', e)
      } finally {
        this.carregando = false
      }
    },
    abrirFormulario(reserva = null) {
      this.editarModo = !!reserva
      this.novaReserva = reserva
        ? { ...reserva }
        : { clienteId: null, hospedagemId: null, dataEntrada: '', dataSaida: '', hospedes: null }
      this.formVisivel = true
    },
    async salvarReserva() {
      const dados = {
        clienteId: this.novaReserva.clienteId,
        hospedagemId: this.novaReserva.hospedagemId,
        dataEntrada: this.novaReserva.dataEntrada,
        dataSaida: this.novaReserva.dataSaida,
        hospedes: this.novaReserva.hospedes
      }

      try {
        if (this.editarModo && this.novaReserva.id) {
          await axios.put(`http://localhost:3000/reservas/${this.novaReserva.id}`, dados)
        } else {
          await axios.post('http://localhost:3000/reservas', dados)
        }
        this.formVisivel = false
        this.carregarTudo()
      } catch (e) {
        console.error('Erro ao salvar reserva:', e)
      }
    },
    async excluirReserva(id) {
      const confirmar = confirm('Tem certeza que deseja excluir esta reserva?')
      if (!confirmar) return

      try {
        await axios.delete(`http://localhost:3000/reservas/${id}`)
        this.carregarTudo()
      } catch (e) {
        console.error('Erro ao excluir reserva:', e)
      }
    }
  }
}
</script>
