<template>
  <div class="volume_control_bg">
    <img v-if="volume_value>0" @click="turnOff" class="volume_icon" src="@/assets/volume.png" />
    <img v-else @click="trunOn" class="volume_icon" src="@/assets/mute.png" alt srcset />
    <div ref="parentVolume" class="volume_progress_parent">
      <div ref="childVolume" class="volume_progress_child" :style="{width:`${volume_value}%`}"></div>
    </div>
  </div>
</template>
<script>
let volume_cache = 75;
let parent_dom = null,
  child_dom = null;
console.log(parent_dom, child_dom);
function handelNum(num) {
  if (num < 0) {
    return 0;
  } else if (num > 100) {
    return 100;
  } else {
    return num;
  }
}
export default {
  name: "volume_control",
  model: {
    prop: "volume",
    event: "changeVolume"
  },
  props: {
    volume: { type: Number, default: volume_cache }
  },
  data() {
    return {
      volume_value: volume_cache
    };
  },
  watch: {
    volume(value) {
      this.volume_value = Number(value);
    }
  },
  mounted() {
    parent_dom = this.$refs.parentVolume;
    child_dom = this.$refs.childVolume;
    this.addEvent();
  },
  methods: {
    turnOff() {
      volume_cache = this.volume_value;
      this.volume_value = 0;
      this.$emit("changeVolume", this.volume_value);
    },
    trunOn() {
      this.volume_value = volume_cache;
      this.$emit("changeVolume", this.volume_value);
    },
    addEvent() {
      //   console.log("parent_dom.onmousedown", parent_dom);
      parent_dom.onmousedown = ev => {
        // console.log(ev);
        const parseStyle = window.getComputedStyle(parent_dom);
        const total_width = parseInt(parseStyle.width);
        const initail_x = parseInt(parent_dom.offsetLeft);
        const click_x = parseInt(ev.clientX);
        this.volume_value = handelNum(
          (100 * (click_x - initail_x)) / total_width
        );
        this.$emit("changeVolume", this.volume_value);
        console.log(total_width, initail_x, click_x, this.volume_value);
        const vm = this;
        function mouseMove(event) {
          const move_x = parseInt(event.clientX);
          vm.volume_value = handelNum(
            (100 * (move_x - initail_x)) / total_width
          );
          vm.$emit("changeVolume", vm.volume_value);
        }
        function mouseUp() {
          document.removeEventListener("mousemove", mouseMove);
          document.removeEventListener("mouseup", mouseUp);
        }
        document.addEventListener("mousemove", mouseMove, false);
        document.addEventListener("mouseup", mouseUp, false);
      };
    }
  }
};
</script>
<style scoped>
.volume_control_bg {
  width: 100%;
  height: 100%;
  display: flex;
  cursor: pointer;
  justify-content: space-between;
  align-items: center;
}
.volume_icon {
  height: 65%;
  /* width: 20%; */
}
.volume_progress_parent {
  width: 82%;
  height: 20%;
  background-color: #fff;
  overflow: hidden;
  border-radius: 10px;
}
.volume_progress_child {
  height: 100%;
  background-color: #cc3366;
  border-radius: 10px;
}
</style>
