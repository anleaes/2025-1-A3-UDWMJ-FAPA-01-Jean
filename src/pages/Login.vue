<template>
  <q-page padding class="row items-center justify-center">
    <q-card class="login-card">
      <q-card-section>
        <div class="text-h5 q-mb-md text-center">Login</div>

        <q-form @submit.prevent="entrar" ref="form">
          <q-input
            filled
            v-model="email"
            label="E-mail"
            type="email"
            :rules="[val => !!val || 'E-mail é obrigatório']"
            lazy-rules
            autofocus
            clearable
          />

          <q-input
            filled
            v-model="senha"
            label="Senha"
            type="password"
            :rules="[val => !!val || 'Senha é obrigatória']"
            lazy-rules
            class="q-mt-md"
            clearable
          />

          <q-btn
            label="Entrar"
            color="primary"
            type="submit"
            class="full-width q-mt-lg"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      senha: ''
    }
  },
  methods: {
    entrar() {
      this.$refs.form.validate().then(valid => {
        if (valid) {
          localStorage.setItem('usuarioLogado', 'true')
          this.$router.push('/hospedagens')
        }
      })
    }
  }
}
</script>

<style scoped>
.login-card {
  max-width: 400px;
  width: 90vw;
}
</style>
