<template>
  <q-layout view="lHh Lpr lFf">

    <q-header elevated class="bg-stayez text-white">
      <q-toolbar class="q-px-md">

        <!-- Logo StayEZ estilizado -->
        <q-btn flat dense class="stayez-logo no-uppercase" @click="$router.push('/')">
          StayEZ
        </q-btn>

        <q-space />

        <!-- Botões de navegação -->
        <q-btn flat dense icon="home" label="Home" class="text-white" @click="$router.push('/')" />
        <q-btn flat dense icon="login" label="Login" class="text-white" @click="$router.push('/login')" />
        <q-btn flat dense icon="hotel" label="Hospedagens" class="text-white" @click="$router.push('/hospedagens')" />
        <q-btn flat dense icon="people" label="Clientes" class="text-white" @click="$router.push('/clientes')" />
        <q-btn flat dense icon="event" label="Reservas" class="text-white" @click="$router.push('/reservas')" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout'
}
</script>

<style scoped>
/* Gradiente aconchegante */
.bg-stayez {
  background: linear-gradient(90deg, #d97729 0%, #b55a1f 100%);
}

/* Logo StayEZ com estilo */
.stayez-logo {
  font-weight: 700;
  font-size: 1.8rem;
  letter-spacing: 0.05em;
  transition: color 0.3s ease;
  user-select: none;
}

.stayez-logo:hover {
  color: #f3c88c;
  cursor: pointer;
}

/* Botões personalizados */
.q-btn--flat.text-white {
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.03em;
  transition: background-color 0.3s ease;
}

.q-btn--flat.text-white:hover {
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}
</style>
