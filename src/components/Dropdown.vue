<template>
  <div id="dropdown" class="dropdown" ref="dropdown">
    <div ref="myDropdown" :class="{'show':isOpen}" @click="toggleDropdown">
      <slot name="trigger"></slot>
    </div>
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <teleport to="body">
      <div v-show="isOpen"
           :class="[widthClass, alignmentClasses,offsetClass, position]"
           class="absolute z-[55] rounded-[4px] shadow-lg"
           :style="{'top': coordinates.top + 'px', 'left': coordinates.left + 'px'}">
        <div class="ring-1 ring-black rounded-[4px] ring-opacity-5 w-full" :class="contentClasses">
          <slot name="content" />
        </div>
      </div>
      </teleport>
    </transition>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, computed, watch} from 'vue';

const props = defineProps({
  buttonText: String,
  closeOnInsideClick: {
    type: Boolean,
    default: true,
  },

  align: {
    type: String,
    default: 'right',
  },
  width: {
    type: String,
    default: 'full',
  },
  offset: {
    type: String,
    default: '2',
  },
  position: {
    type: String,
    default: 'bottom',
  },
  contentClasses: {
    type: Array,
    default: () => ['py-2', 'bg-white'],
  },
});
const emits = defineEmits(['isOpen']);
const coordinates = ref({top: 0, left: 0});
const dropdown = ref(null);
const isOpen = ref(false);

watch(isOpen, () => {
  emits('isOpen', isOpen.value);
});

const toggleDropdown = (event) => {
  isOpen.value = !isOpen.value;
  let myDiv = event.target;
  let boundingRect = myDiv.getBoundingClientRect();
  coordinates.value.left = boundingRect.right ;
  coordinates.value.top =  boundingRect.bottom;
};

const widthClass = computed(() => {
  return {
    '36': 'w-36',
    '40': 'w-40',
    '44': 'w-44',
    '48': 'w-48',
    '52': 'w-52',
    '56': 'w-56',
    '60': 'w-60',
    '64': 'w-64',
    '72': 'w-72',
    '80': 'w-80',
  }[props.width.toString()];
});
const offsetClass = computed(() => {
  return {
    '0': '',
    '1': 'mt-1',
    '2': 'mt-2',
  }[props.offset.toString()];
});

const alignmentClasses = computed(() => {
  if (props.align === 'left') {
    return 'origin-top-left left-0';
  }

  if (props.align === 'right') {
    return 'origin-top-right right-0';
  }

  if (props.align === 'top') {
    return 'bottom-11 right-0';
  }

  return 'origin-top';
});
</script>