<template>
  <div class="viedo_list_bg">
    <div class="viedo_list_title">
      <div class="viedo_title_layer">播放列表</div>
      <!-- <div class="add_viedo" title="添加视频">
        <img class="add_imgage" src="@/assets/add_viedo.png" alt srcset />
      </div>-->
    </div>
    <div class="viedo_list_container">
      <div
        class="viedo_list_item"
        @dblclick.prevent="ondbclick(item)"
        :class="classNameString[Number(item.viedo_name===current_viedo_name)]"
        :key="item.viedo_name"
        v-for="(item) in viedo_list"
        :title="item.viedo_name"
      >
        <div class="viedo_list_control"></div>
        <div class="viedo_list_content">{{ item.viedo_name }}</div>
      </div>
    </div>
    <div class="addNewVeido" @click="addNewVeido">添加</div>
    <input
      ref="fileInput"
      type="file"
      @input="getFiles"
      multiple
      accept="video/*"
      style="display:none"
    />
  </div>
</template>

<script>
// const classNameString = []
export default {
  data() {
    return {
      classNameString: ["noPlaying", "isPlaying"],
      $app_viedo_list: window.$app.viedo_list,
      current_playing_viedo: window.$app.current_viedo_data,
      // viedo_list: [],
      current_viedo_name: "",
      current_index: 0
    };
  },
  computed: {
    viedo_list() {
      return window.$app.viedo_list;
    }
  },
  watch: {
    current_playing_viedo: {
      deep: true,
      handler(value) {
        console.log(value, "valuevalue");
        this.current_viedo_name = value.viedo_name;
        let i = 0,
          len = this.viedo_list.length;
        for (i; i < len; i++) {
          if (this.current_viedo_name === this.viedo_list[i].viedo_name) {
            this.current_index = i;
            break;
          }
        }
      }
    }
  },
  methods: {
    addNewVeido() {
      const input_dom = this.$refs.fileInput;
      input_dom.click();
    },
    getFiles() {
      const file_list = [...this.$refs.fileInput.files];
      console.log(file_list);
      file_list.forEach(file => {
        const viedo_name = file.name,
          url = window.URL.createObjectURL(file);

        const viedo_list_item = {
          viedo_name,
          src: url,
          is_playing: false
        };
        window.$app.addViedo(viedo_list_item);
      });
    },
    playNext() {
      let next_index = this.current_index + 1;
      let item = this.viedo_list[next_index];
      if (item) {
        this.ondbclick(item);
      }
    },
    playForward() {
      if (this.current_index > 0) {
        let forward_index = this.current_index - 1;
        let item = this.viedo_list[forward_index];
        if (item) {
          this.ondbclick(item);
        }
      }
    },
    ondbclick(v1, v2) {
      console.log(v1, v2);
      this.$emit("playViedo", v1);
    }
  }
};
</script>

<style scoped>
.viedo_list_bg {
  margin: 0 auto;
  width: 96%;
  height: 100%;
  font-size: 12px;
  color: #fff;
}
.viedo_list_title {
  width: 100%;
  height: 3%;
  display: flex;
  justify-content: flex-start;
  border-bottom: 1px solid #fff;
}
.viedo_title_layer {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.viedo_list_container {
  height: 92%;
  overflow: auto;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}
.viedo_list_container::-webkit-scrollbar {
  width: 0 !important;
}

.add_viedo {
  /* width: 20%; */
  height: 100%;
  display: flex;
  align-items: center;
}
.add_imgage {
  /* width: 100%; */
  height: 90%;
}
.viedo_list_item {
  cursor: pointer;
  width: 100%;
  height: 3.5%;
  font-size: 3%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.viedo_list_control {
  width: 2%;
}
.viedo_list_content {
  width: 92%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}
.isPlaying {
  color: #33ccff;
  background-color: #00ffff33;
}
.addNewVeido {
  margin: 0 auto;
  width: 60%;
  height: 4%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #6666ff;
  border-radius: 5px;
  cursor: pointer;
}
</style>