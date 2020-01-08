<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>-->
    <html-player-main></html-player-main>
  </div>
</template>
<script>
export default {
  components: {
    htmlPlayerMain: () => import("@/views/main.vue")
  },
  data() {
    return {
      viedo_list: [],
      viedo_name_list: [],
      current_viedo_data: {
        viedo_name: "",
        is_playing: false
      }
    };
  },
  created() {
    window.$app = this;
  },
  methods: {
    addViedo(viedo_item) {
      console.log("viedo_item", viedo_item);
      if (this.viedo_name_list.indexOf(viedo_item.viedo_name) < 0) {
        this.viedo_list.push(viedo_item);
        this.viedo_name_list.push(viedo_item.viedo_name);
      }
    },
    setCurrentPlayViedo(viedo_item) {
      console.log("setCurrentPlayViedo", viedo_item);
      this.current_viedo_data.viedo_name = viedo_item.viedo_name;
      this.current_viedo_data.is_playing = !!viedo_item.is_playing;
    }
  }
};
</script>
<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
