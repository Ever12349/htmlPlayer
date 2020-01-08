<template>
  <div class="tool-bar-bg">
    <div class="placeholder_left"></div>
    <div class="tool-botton">
      <img
        class="player_icon"
        @click="mediaForward"
        src="@/assets/mediaForward.png"
        title="上一个"
        alt
      />

      <img
        v-if="!is_playing_flag"
        @click="media_play"
        class="player_icon"
        src="@/assets/mediaPlay.png"
        title="播放"
      />
      <img v-else class="player_icon" @click="media_pause" title="暂停" src="@/assets/mediaPause.png" />
      <img class="player_icon" @click="mediaStop" src="@/assets/mediaStop.png" title="停止" alt />
      <img class="player_icon" @click="mediaNext" src="@/assets/mediaNext.png" title="下一个" alt />
      <div class="volume_control">
        <volume-control v-model="volume"></volume-control>
      </div>
    </div>
    <div class="placeholder_right">
      <img
        :title="viedo_list_layer"
        @click="toggleViedoList"
        class="viedo_list"
        src="@/assets/viedo_list.jpg"
      />
    </div>
  </div>
</template>
<script>
let layer_content = ["展开播放列表", "关闭播放列表"];
export default {
  props: {
    is_playing: {
      type: Boolean,
      default: false
    }
  },
  components: {
    volumeControl: () => import("@/components/volume_control.vue")
  },
  data() {
    return {
      volume: 0.75,
      is_playing_flag: this.is_playing,
      // viedo_list_layer: layer_content[0],
      show_viedo_list_flag: false
    };
  },
  watch: {
    volume(value) {
      this.$emit("changeVolume", value / 100);
    },
    is_playing(value) {
      this.is_playing_flag = value;
    },
    show_viedo_list_flag(value) {
      this.$emit("showViedoListFlag", value);
    }
  },
  computed: {
    viedo_list_layer() {
      return layer_content[Number(this.show_viedo_list_flag)];
    }
    // is_playing_flag() {
    //   return this.is_playing;
    // }
  },
  mounted() {
    document.addEventListener(
      "keydown",
      e => {
        // console.log(e);
        let key = e.key;
        console.log(key);
        const vm = this;
        switch (key) {
          case " ":
            !(function(flag) {
              if (flag) {
                vm.media_pause();
              } else {
                vm.media_play();
              }
            })(this.is_playing_flag);
            break;
          case "PageDown":
            this.mediaNext();
            break;
          case "PageUp":
            this.mediaForward();
            break;
          case "ArrowUp":
            this.volume = this.volume + 2 <= 100 ? this.volume + 2 : 100;
            break;
          case "ArrowDown":
            this.volume = this.volume - 2 > 0 ? this.volume - 2 : 0;
        }
      },
      false
    );
  },
  methods: {
    getInitialVolume() {
      return this.volume;
    },
    toggleViedoList() {
      this.show_viedo_list_flag = !this.show_viedo_list_flag;
    },
    mediaForward() {
      this.$emit("mediaFarward");
    },
    mediaStop() {
      this.$emit("mediaStop");
    },
    mediaNext() {
      this.$emit("mediaNext");
    },
    media_play() {
      //点击播放
      this.is_playing_flag = true;
      this.$emit("mediaPlay");
    },
    media_pause() {
      //点击暂停
      this.is_playing_flag = false;
      this.$emit("mediaPause");
    }
  }
};
</script>
<style scoped>
.tool-bar-bg {
  height: 100%;
  display: flex;
}
.player_icon_play {
  height: 90%;
}
.placeholder_left {
  flex: 1;
}
.placeholder_right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tool-botton {
  width: 15%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}
.viedo_list {
  width: 3%;
  box-shadow: 3px 3px 3px #000;
  border: 1px solid #ccc;
  margin-left: 55%;
}
.player_icon {
  /* width: 50%; */
  height: 80%;
  margin-right: 2%;
  cursor: pointer;
}
.volume_control {
  width: 50%;
  height: 70%;
  align-self: flex-end;
  margin-left: 5%;
  margin-bottom: 3%;
}
</style>