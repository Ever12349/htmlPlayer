<template>
  <div class="player_bg">
    <input
      ref="fileInput"
      type="file"
      @change="getFiles"
      multiple
      accept="video/*"
      style="display:none"
    />
    <div v-show="show_icon_flag" class="player_start">
      <img
        title="选择文件"
        @click="chooseViedo"
        class="player_icon"
        src="@/assets/player_start.png"
        alt
      />
    </div>
    <video
      v-show="show_viedo_flag"
      @click.stop="mediaToggle"
      ref="viedo_player"
      class="viedo_player"
      :src="current_viedo_src"
      @timeupdate="getProgress"
      @canplay="oncanplay"
      @playing="playing"
      @ended="onended"
      @abort="onabort"
      @pause="onpause"
    ></video>
  </div>
</template>

<script>
let player = null;
let inputDom = null;
import { getObjectURL } from "../js/uitil.js";
export default {
  model: {
    prop: "progressValue",
    event: "progressChanage"
  },
  props: {
    progressValue: {
      type: Number
    },
    viedoData: {
      type: Object
    }
  },
  data() {
    return {
      // viedo_flag: true,
      show_icon_flag: true,
      show_viedo_flag: false,
      current_viedo_src: null,
      viedo_data: {
        viedo_name: null,
        is_playing: false,
        duration: 0,
        currentSrc: null,
        create_time: null,
        currentTime: 0
      }
    };
  },
  mounted() {
    player = this.$refs.viedo_player;
    inputDom = this.$refs.fileInput;
    // console.log(player);
  },
  methods: {
    mediaToggle() {
      if (this.viedo_data.is_playing) {
        player.pause();
      } else {
        // this.viedo_flag = true;
        player.play();
      }
    },
    mediaSetVolume(value) {
      player.volume = value;
    },
    mediaStop() {
      // let temp_src = this.current_viedo_src;
      // this.current_viedo_src = null;
      player.pause();
      player.currentTime = 0;
      // player.load();
      // this.viedo_flag = false;
      // player.load();
      // this.current_viedo_src = temp_src;
      // this.$nextTick(() => {
      //   // player.load();
      //   this.viedo_flag = false;
      // });
      // this.$nextTick(() => {
      //   this.viedo_flag = true;
      //   player.load();
      // });
      this.show_icon_flag = true;
      this.show_viedo_flag = false;
    },
    mediaPlay() {
      console.log("mediaPlay", this.viedoData);
      // if (this.viedoData && this.viedoData.src === this.current_viedo_src) {
      //   return false;
      // }
      // this.viedo_flag = true;
      player.load();
      // try {
      //   this.mediaStop();
      // } catch (e) {
      //   console.log(e);
      // }
      // if (this.viedo_data.is_playing) {
      //   this.mediaStop();
      // }

      if (this.viedoData) {
        this.current_viedo_src = this.viedoData.src;
      }
      this.$nextTick(() => {
        player.play();
      });
    },
    mediaPause() {
      console.log("mediaPause");
      player.pause();
    },
    onabort() {
      this.onended();
    },
    onpause() {
      this.viedo_data.is_playing = false;
      this.emitViedioDetail(this.viedo_data);
    },
    onended() {
      this.viedo_data.is_playing = false;
      this.viedo_data.duration = 0;
      this.viedo_data.currentTime = 0;
      // this.viedo_data.currentSrc = null;
      // this.viedo_data.viedo_name = null;
      this.show_icon_flag = true;
      this.show_viedo_flag = false;

      this.emitViedioDetail(this.viedo_data);
      // this.mediaStop();
      // window.$app.setCurrentPlayViedo(this.viedo_data);
    },
    oncanplay() {
      // this.show_icon_flag = false;
      // this.show_viedo_flag = true;
      // console.log("canplay", this.viedoData, this.viedo_data);
      // this.viedo_data.is_playing = true;
      // this.$nextTick(() => {
      //   // this.viedo_data.duration = player.duration;
      //   this.viedo_data.currentTime = player.currentTime;
      //   this.viedo_data.currentSrc = player.currentSrc;
      // this.viedo_data.viedo_name = this.viedoData
      //   ? this.viedoData.viedo_name
      //   : this.viedo_data.viedo_name;
      //   // this.viedo_data.viedo_name = player.
      //   this.emitViedioDetail(this.viedo_data);
      //   window.$app.setCurrentPlayViedo(this.viedo_data);
      // });
    },
    playing() {
      console.log("player", this.viedo_data, this.viedoData);
      this.show_icon_flag = false;
      this.show_viedo_flag = true;

      this.viedo_data.is_playing = true;
      this.viedo_data.duration = player.duration;
      this.viedo_data.currentTime = player.currentTime;
      this.viedo_data.currentSrc = player.currentSrc;
      this.viedo_data.viedo_name = this.viedoData
        ? this.viedoData.viedo_name || this.viedo_data.viedo_name
        : this.viedo_data.viedo_name;
      console.log("playerssssss", this.viedo_data.viedo_name, this.viedoData);

      // this.viedo_data.viedo_name = player.
      this.emitViedioDetail(this.viedo_data);
      window.$app.setCurrentPlayViedo(this.viedo_data);
    },
    getProgress() {
      const current_time = player.currentTime;
      const total_time = player.duration;
      let progress = current_time / total_time;
      this.$emit("progressChanage", progress * 100);

      // this.viedo_data.is_playing = true;
      // this.viedo_data.duration = player.duration;
      this.viedo_data.currentTime = player.currentTime;
      // this.viedo_data.viedo_name = player.
      this.emitViedioDetail(this.viedo_data);
    },
    emitViedioDetail(data) {
      this.$emit("newViedioData", data);
    },
    setProgress(progress_value) {
      if (progress_value.checked) {
        player.pause();
        this.$nextTick(() => {
          let duration = player.duration,
            currentTime = (duration * progress_value.progress_value) / 100;
          player.currentTime = currentTime;
        });
      } else {
        player.play();
      }
    },
    getFiles() {
      // const files = inputDom.files[0];
      let file_list = [...inputDom.files];
      file_list.sort();
      file_list.forEach((files, index) => {
        console.log(files, "ffffffff");
        const url = getObjectURL(files);
        if (index == 0) {
          this.current_viedo_src = url;
          this.show_icon_flag = false;
          this.show_viedo_flag = true;
          this.viedo_data.viedo_name = files.name;
          this.viedo_data.currentSrc = url;
          this.viedo_data.create_time = files.lastModifiedDate;
          this.$nextTick(() => {
            player.play();
          });
        }

        // inputDom.value = "";

        const viedo_list_item = {
          viedo_name: files.name,
          src: url,
          is_playing: true
        };
        window.$app.addViedo(viedo_list_item);
      });
      inputDom.value = "";
      // if (files) {
      //   console.log(files, "ffffffff");
      //   const url = window.URL.createObjectURL(files);
      //   this.current_viedo_src = url;
      //   this.show_icon_flag = false;
      //   this.show_viedo_flag = true;
      //   this.$nextTick(() => {
      //     player.play();
      //   });

      //   this.viedo_data.viedo_name = files.name;
      //   this.viedo_data.currentSrc = url;
      //   this.viedo_data.create_time = files.lastModifiedDate;

      //   inputDom.value = "";

      //   const viedo_list_item = {
      //     viedo_name: files.name,
      //     src: url,
      //     is_playing: true
      //   };
      //   window.$app.addViedo(viedo_list_item);
      // }
    },
    chooseViedo() {
      inputDom.click();
    }
  }
};
</script>

<style scoped>
.player_bg {
  width: 100%;
  height: 100%;
}
.viedo_player {
  width: 100%;
  height: 100%;
  background-color: #000;
}
.player_start {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.player_icon {
  width: 6%;
}
</style>