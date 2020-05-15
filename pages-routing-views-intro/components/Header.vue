<template>
  <header class="header">
    <ul class="nav-items">
      <nuxt-link to="/" tag="li"> <a>Home</a> </nuxt-link>
      <nuxt-link to="/users" tag="li"> <a>Users</a> </nuxt-link>
    </ul>
  </header>
</template>

<script>
export default {};
</script>

<style scoped>
.header {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ccc;
}

.nav-items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 80%;
}
</style>
