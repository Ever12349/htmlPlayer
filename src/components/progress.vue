<template>
  <div class="progress_bg">
    <div ref="parent_progress" class="parent_progress">
      <div ref="child_progress" :style="{width:`${child_progress_width}`}" class="child_progress"></div>
      <div ref="progress_button" :style="{left:`${button_left}`}" class="progress_button">
        <!-- <div class="progress_inner"></div> -->
      </div>
    </div>
  </div>
</template>
<script>
let parent_progress_dom = null,
  //   child_progress_dom = null,
  progress_button_dom = null;
let change_progress_flag = true;
function constrainerNum(value) {
  // console.log(value, "valuevalue");
  if (value) {
    if (value > 100) {
      return 100;
    } else if (value <= 0) {
      return 0;
    } else {
      return value;
    }
  } else {
    return 0;
  }
}
let init_x;
export default {
  model: {
    prop: "progressValue",
    event: "progessChange"
  },
  props: {
    progressValue: {
      type: [Number, String]
    }
  },
  data() {
    return {
      child_progress_width: "0px",
      button_left: "0px",
      init_left: null,
      total_width: 0
    };
  },
  updated() {
    init_x = parseInt(parent_progress_dom.offsetLeft);
  },
  watch: {
    progressValue(value, old_value) {
      if (value === old_value) {
        return;
      }
      this.setProgress(value);
    }
  },
  mounted() {
    const refs = this.$refs;
    parent_progress_dom = refs.parent_progress;
    progress_button_dom = refs.progress_button;
    let init_style = window.getComputedStyle(progress_button_dom);
    this.total_width = parseInt(
      window.getComputedStyle(parent_progress_dom).width
    );

    let button_width = parseInt(init_style.width) / 2;
    parent_progress_dom.onmousedown = ev => {
      // init_style = window.getComputedStyle(progress_button_dom);
      // this.total_width = parseInt(
      //   window.getComputedStyle(parent_progress_dom).width
      // );
      // init_x = parseInt(progress_button_dom.offsetLeft);
      // button_width = parseInt(init_style.width) / 2;
      this.total_width = parseInt(
        window.getComputedStyle(parent_progress_dom).width
      );

      // console.log(this.total_width, init_x, button_width, ev.clientX);
      const target_x = ev.clientX - init_x;
      this.button_left = target_x + button_width + "px";
      this.child_progress_width = target_x + button_width * 2 + "px";
      let progress_value = constrainerNum((100 * target_x) / this.total_width);
      this.$emit("progessChange", progress_value);
      this.$emit("setNewProgress", { progress_value, checked: true });
      const vm = this;
      function mouseMove(e) {
        change_progress_flag = false;
        const move_x = e.clientX - init_x;
        if (move_x >= 0) {
          vm.button_left = move_x + "px";
          vm.child_progress_width = move_x + button_width+ "px";
          let progress_value = constrainerNum((100 * move_x) / vm.total_width);
          vm.$emit("progessChange", progress_value);
          vm.$emit("setNewProgress", { progress_value, checked: true });
        } else {
          vm.button_left = "0px";
          vm.child_progress_width = "0px";
          vm.$emit("progessChange", 0);
          vm.$emit("setNewProgress", { progress_value: 0, checked: true });
        }
      }
      function mouseUp() {
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);
        change_progress_flag = true;
        vm.$emit("setNewProgress", { checked: false });
      }
      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);
    };

    this.setProgress(this.progressValue);
  },
  methods: {
    setProgress(value) {
      let props_width = constrainerNum(value) / 100;
      let x = 0;
      if (parent_progress_dom) {
        x =
          parseInt(window.getComputedStyle(parent_progress_dom).width) *
          props_width;
      }
      if (progress_button_dom && change_progress_flag) {
        let extra_width =
          parseInt(window.getComputedStyle(progress_button_dom).width) / 2;
        this.button_left = x - extra_width + "px";
        this.child_progress_width = x + "px";
      }
      change_progress_flag = true;
    }
  }
};
</script>
<style scoped>
.progress_bg {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: 0.5%;
  /* cursor: pointer; */
  /* padding-left: 3%; */
  /* justify-content: center; */
}
.parent_progress {
  width: 100%;
  height: 25%;
  background-color: #fff;
  border-radius: 4px;
  cursor: pointer;
  /* overflow: hidden; */
}
.child_progress {
  height: 100%;
  background-color: #0066ff;
  position: relative;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.progress_button {
  width: 12px;
  height: 12px;
  background-color: #277dd5;
  position: relative;
  bottom: 135%;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
}
.progress_inner {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #ff99ff;
}
</style>