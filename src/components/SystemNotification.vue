<template>
  <div v-show="show" class="flex items-start my-shadow min-h-16">
    <hr class="w-2 h-full rounded-[4px]" :class="typeOfNotification === 'success' ? 'bg-[#22C33D]' : 'bg-[#C64848]'"/>
    <div class="w-[480px] bg-white py-3 px-4 flex items-start border-[1px] rounded-[16px] z-1000 absolute"
         :style="{'bottom': coordinates.bottom + 'px', 'left': coordinates.left + 'px'}">
      <div class="basis-0 rounded-full p-1" :class="typeOfNotification === 'success' ? 'bg-[#22C33D]' : 'bg-[#C64848]'">
        <IconCheck color="white" v-if="typeOfNotification === 'success'"/>
        <IconX color="white" v-else-if="typeOfNotification === 'error'"/>
      </div>
      <div class="px-4 basis-2/3">
        <h2 class="font-semibold text-[16px] leading-[125%] text-[#19191B] capitalize">{{heading}}</h2>
        <div class="text-[13px] leading-[150%] text-[#71717A]" v-html="message"></div>
      </div>
      <div >
        <IconX color="#71717A" class="cursor-pointer absolute top-1/2 right-4 -translate-y-1/2" @click="emit('update:show', false)"/>
      </div>
    </div>
  </div>

</template>

<script setup>
import {IconX, IconCheck} from '@tabler/icons-vue';

const props = defineProps({
  typeOfNotification: {
    type: String,
  },
  heading: {
    type: String,
  },
  message: {
    type: String,
  },
  show: {
    type:  Boolean,
    default: false,
  },
  coordinates: {
    type: Object,
    default: {bottom: 50, left: 100},
  },
});

const emit = defineEmits(['update:show']);
</script>

<style>
.my-shadow {
  box-shadow: 0 8px 8px 0 #00000014;
}
</style>