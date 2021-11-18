<template>
  <div class="PannelBoxContainer">
    <div class="bk bk-left-top" />
    <div class="bk bk-left-top2" />
    <div class="bk bk-left-bottom" />
    <div class="bk bk-left-bottom2" />
    <div class="bk bk-right-top" />
    <div class="bk bk-right-top2" />
    <div class="bk bk-right-bottom" />
    <div class="bk bk-right-bottom2" />
    <div class="content">
      <slot name="content" />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'PannelBox',
}
</script>

<style lang="scss" scoped>
.PannelBoxContainer {
  min-width: 360px;
  background-color: #080520b8;
  position: relative;
  .content {
    top: 31px;
    padding: 10px 30px 20px;
    min-width: 200px;
    min-height: 200px;
  }
  .bk {
    width: 10%;
    height: 10%;
    min-height: 30px;
    position: absolute;
  }
  .bk-right-bottom {
    right: -2px;
    bottom: -2px;
    border-right: 2px solid #43c7f8;
    border-image:linear-gradient(to bottom, #00000047, #004be9) 1 10;
  }
  .bk-right-bottom2{
    right: -2px;
    bottom: -2px;
    border-image: linear-gradient(to right, #00000047, #004be9) 1 10;
    border-bottom: 2px solid #43c7f8;
  }
  .bk-right-top {
    right: -2px;
    top: -2px;
    border-top: 2px solid #43c7f8;
    border-image:linear-gradient(to right, #00000047, #004be9) 1 10;
  }
  .bk-right-top2 {
    right: -2px;
    top: -2px;
    border-image:linear-gradient(to top, #00000047, #004be9) 1 10;
    border-right: 2px solid #43c7f8;
  }
  .bk-left-top {
    left: -2px;
    top: -2px;
    border-left: 2px solid #43c7f8;
    border-image:linear-gradient(to top, #00000047, #004be9) 1 10;
  }
  .bk-left-top2 {
    left: -2px;
    top: -2px;
    border-image:linear-gradient(to left, #00000047, #004be9) 1 10;
    border-top: 2px solid #43c7f8;
  }
  .bk-left-bottom {
    left: -2px;
    bottom: -2px;
    border-left: 2px solid #43c7f8;
    border-image:linear-gradient(to bottom, #00000047, #004be9) 1 10;
  }
  .bk-left-bottom2 {
    left: -2px;
    bottom: -2px;
    border-image:linear-gradient(to left, #00000047, #004be9) 1 10;
    border-bottom: 2px solid #43c7f8;
  }
}
</style>

