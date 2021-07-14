<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
body,
html {
  height: 100%;
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-size: cover;
  height: 100%;
}

.breadcrumb {
  display: flex;
  list-style: none;
  padding: 1rem 0;
}
.breadcrumb-item {
  margin-right: .5rem;
}
.breadcrumb-item:not(:last-child)::after {
  content: "/";
  margin-left: .5rem;
}
</style>
