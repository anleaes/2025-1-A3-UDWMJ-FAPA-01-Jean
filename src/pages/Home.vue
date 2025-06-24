<template>
  <q-page padding class="column items-center q-gutter-md">

    <q-card class="my-card text-center">
      <q-card-section>
        <div class="text-h4 q-mb-sm">Bem-vindo ao StayEZ!</div>
        <div class="text-subtitle2">
          Gerencie e descubra hospedagens com facilidade.
        </div>
      </q-card-section>

      <q-card-section>
        <div class="text-body1">
          Temos <b>{{ totalHospedagens }}</b> hospedagens cadastradas no sistema.
        </div>
      </q-card-section>

      <q-card-actions align="center" class="q-gutter-sm">
        <q-btn label="Fazer Login" color="primary" icon="login" @click="irParaLogin" unelevated />
        <q-btn label="Ver Hospedagens" color="primary" outline icon="home" @click="irParaHospedagens" />
      </q-card-actions>
    </q-card>

    <div v-if="hospedagens.length">
      <div class="text-h6 q-mt-md">Hospedagens em destaque:</div>
      <div class="row q-col-gutter-md q-mt-sm justify-center">
        <q-card v-for="item in hospedagens.slice(0, 2)" :key="item.id" class="q-ma-sm" style="width: 300px">
          <q-card-section>
            <div class="text-h6">{{ item.nome }}</div>
            <div class="text-subtitle2">{{ item.cidade }} - {{ item.tipo }}</div>
            <div class="text-caption">R$ {{ item.diaria }} / noite • {{ item.quartos }} quartos</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

  </q-page>
</template>

<script>
import axios from 'axios'

export default {
  name: 'HomePage',
  data() {
    return {
      hospedagens: [],
      totalHospedagens: 0
    }
  },
  methods: {
    irParaLogin() {
      this.$router.push('/login')
    },
    irParaHospedagens() {
      this.$router.push('/hospedagens')
    },
    async carregarHospedagens() {
      try {
        const res = await axios.get('http://localhost:3000/hospedagens')
        this.hospedagens = res.data
        this.totalHospedagens = res.data.length
      } catch (e) {
        console.error('Erro ao buscar hospedagens na home:', e)
      }
    }
  },
  mounted() {
    this.carregarHospedagens()
  }
}
</script>

<style scoped>
.my-card {
  max-width: 500px;
  width: 100%;
}
</style>
