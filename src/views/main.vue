<template>
  <div class="html-player-bg">
    <!-- <div class="test-bottom" @click="testClick">测试按钮</div>
    <input ref="fileInput" type="file" @input="choose" multiple accept="video/*" />

    <video class="viedo_div" ref="viedo" :src="viedo_url"></video>-->
    <div ref="playerDiv" class="player-div">
      <!-- <div class="open" @click="open">展开</div> -->
      <div class="player_container">
        <player
          v-model="progressValue"
          @newViedioData="getNewViedoData"
          ref="mediaPlayer"
          :viedoData="viedo_data"
        ></player>
      </div>
      <div :style="{width:`${autoWidth}`}" class="tool-bar">
        <div class="player_progress">
          <v-progress class="progress" v-model="progressValue" @setNewProgress="setNewProgress"></v-progress>
          <div class="time_layer">{{time_layer}}</div>
        </div>
        <div class="player_control">
          <tool-bar
            ref="tooBar"
            :is_playing="is_playing"
            @mediaPlay="toggle"
            @mediaPause="pause"
            @mediaStop="stop"
            @showViedoListFlag="changeViedoListFlag"
            @mediaFarward="mediaFarward"
            @mediaNext="mediaNext"
            @changeVolume="changeVolume"
          ></tool-bar>
        </div>
      </div>
    </div>
    <!-- <transition
      name="custom-classes-transition"
      enter-active-class="animated bounceInRight"
      leave-active-class="animated bounceOutRight"
    >-->
    <div v-show="show_viedo_list_flag" class="viedio-list">
      <viedo-list ref="viedoList" @playViedo="playViedo"></viedo-list>
    </div>
    <!-- </transition> -->
  </div>
</template>
<script>
let playerDom = null;
function handle(time) {
  let target_time = parseInt(time);
  let result_time = "00:00:00";
  if (target_time) {
    let hour = Math.floor(target_time / 3600),
      t_minutes = target_time % 3600,
      minutes = Math.floor(t_minutes / 60),
      seconds = t_minutes % 60;
    hour = hour.toString().length > 1 ? `${hour}` : `0${hour}`;
    minutes = minutes.toString().length > 1 ? `${minutes}` : `0${minutes}`;
    seconds = seconds.toString().length > 1 ? `${seconds}` : `0${seconds}`;
    return `${hour}:${minutes}:${seconds}`;
  }
  return result_time;
}
export default {
  components: {
    player: () => import("@/components/player.vue"),
    toolBar: () => import("@/components/toolBar.vue"),
    vProgress: () => import("@/components/progress.vue"),
    viedoList: () => import("@/components/viedo_list.vue")
  },
  data() {
    return {
      progressValue: 0,
      current_url: null,
      autoWidth: "100%",
      show_viedo_list_flag: false,
      show_tool_bar_flag: false,
      time_flag: false,
      viedo_data: null,
      is_playing: false,
      duraton: 0,
      current_time: 0
    };
  },
  mounted() {
    playerDom = this.$refs.playerDiv;
    this.setVolume();
    // this.$nextTick(() => {
    //   console.log(this.$refs.tooBar, "this.$refs");
    //   const volume_value = this.$refs.tooBar.getInitialVolume();
    //   console.log(volume_value, "volume");
    // });
    // const volume_value = this.$refs.tooBar.getInitialVolume();
    // console.log(volume_value, "volume");
  },
  computed: {
    time_layer() {
      return `${handle(this.current_time)} / ${handle(this.duraton)}`;
    }
  },
  watch: {
    // progressValue(value) {
    //   console.log(value);
    // },
    show_viedo_list_flag(value) {
      if (value) {
        this.$nextTick(() => {
          const current_width = window.getComputedStyle(playerDom).width;
          console.log(current_width, "current_width");
          this.autoWidth = current_width;
        });
      } else {
        this.autoWidth = "100%";
      }
    }
  },
  methods: {
    changeVolume(value) {
      console.log(value, "changeV");
      this.$refs.mediaPlayer.mediaSetVolume(value);
    },
    setVolume() {
      const vm = this;
      function getVolume() {
        const toobarComponents = vm.$refs.tooBar;
        if (!toobarComponents) {
          setTimeout(getVolume, 50);
        } else {
          const volume_value = toobarComponents.getInitialVolume();
          this.changeVolume(volume_value);
          console.log("volume_value", volume_value);
        }
      }
      getVolume();
    },
    changeViedoListFlag(value) {
      this.show_viedo_list_flag = value;
    },
    delayHiddenToolBar(time = 30) {
      let current_time = time;
      const timeer = setInterval(() => {
        if (current_time > 0) {
          current_time = current_time - 2;
        } else {
          this.show_tool_bar_flag = false;
          clearInterval(timeer);
        }
      }, 2000);
    },
    getNewViedoData(data) {
      // console.log("getNewViedoData", data);
      this.is_playing = data.is_playing;
      this.current_time = data.currentTime;
      this.duraton = data.duration;
      // if (!data.is_playing) {
      //   this.viedo_data = null;
      // }
    },
    setNewProgress(progress) {
      // console.log(progress, "progress");
      this.$refs.mediaPlayer.setProgress(progress);
    },
    playViedo(viedo) {
      this.viedo_data = viedo;
      // this.$set(this, "viedo_data", viedo);
      console.log(viedo, "sssss,,,,,,,,,");
      this.$nextTick(() => {
        this.play();
      });
    },
    stop() {
      this.$refs.mediaPlayer.mediaStop();
    },
    toggle() {
      this.$refs.mediaPlayer.mediaToggle();
    },
    play() {
      this.$refs.mediaPlayer.mediaPlay();
    },
    pause() {
      this.$refs.mediaPlayer.mediaPause();
    },
    open() {
      this.show_viedo_list_flag = true;
    },
    close() {
      this.show_viedo_list_flag = false;
    },
    mediaFarward() {
      this.$refs.viedoList.playForward();
    },
    mediaNext() {
      this.$refs.viedoList.playNext();
    },
    testClick() {
      console.log("点击");
    },
    choose(event) {
      console.log(event);
      const inputDom = this.$refs.fileInput;
      console.log(inputDom.files);
      const file_list = inputDom.files;
      if (file_list) {
        const file_detail = [...file_list].map(item => {
          return {
            file_name: item.name,
            url: window.URL.createObjectURL(item),
            create_time: item.lastModifiedDate
          };
        });
        console.log(file_detail);
        this.viedo_data = file_detail[0];
        this.$nextTick(() => {
          const viedo_dom = this.$refs.viedo;
          viedo_dom.play();
        });
        // const viedo_dom = this.$refs.viedo;
        // viedo_dom.play();
      }
    }
  }
};
</script>
<style scoped>
.text-bottom {
  width: 80px;
  height: 50px;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
}
.viedo_div {
  width: 600px;
}
.html-player-bg {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
}
.player-div {
  width: auto;
  /* height: 100%; */
  background-color: #464040;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.player_container {
  /* flex: 1; */
  height: 92%;
}
.tool-bar {
  width: 100%;
  height: 8%;
  background-color: #00ccff38;
  position: absolute;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-top: 1px solid #000;
  padding-left: 1%;
}
.progress {
  width: 85% !important;
}
.player_progress {
  height: 40%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.time_layer {
  margin-left: 3%;
  color: #fff;
  font-size: 1%;
}
.player_control {
  height: 60%;
}
.viedio-list {
  width: 20%;
  height: 100%;
  /* background-color: #fff; */
  background-color: #330033;
}
.open {
  color: #fff;
}
.close {
  color: #fff;
}
</style>