<template>
  <CesiumContainer>
    <template v-slot:configCom>
      <div class="TitleSetCongfig">
      ywh 
      </div>
    </template>
  </CesiumContainer>
</template>
<script lang="ts">
import CesiumContainer from '@/components/CesiumContainer.vue'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'TitleSetCongfig',
  components: { CesiumContainer },
  setup() {
    return {
      
    }
  },
})
</script>

<style lang="scss" scoped>
.TitleSetCongfig {
  position: absolute;
  top: 0px;
  left: 0px;
}
</style>