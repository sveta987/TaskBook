<template>
  <transition leave-active-class="duration-200">
    <div v-show="show" class="fixed inset-0 top-[10%] overflow-y-auto px-4 py-6 sm:px-0 z-[150]">
      <transition
        enter-active-class="ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-show="show" class="fixed inset-0 transform transition-all" @click="$emit('update:show', !closeOnOutsideClick)">
          <div class="absolute inset-0 bg-gray-500 opacity-[60%]">
          </div>
        </div>
      </transition>

      <transition
        enter-active-class="ease-out duration-300"
        enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enter-to-class="opacity-100 translate-y-0 sm:scale-100"
        leave-active-class="ease-in duration-200"
        leave-from-class="opacity-100 translate-y-0 sm:scale-100"
        leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      >
        <div v-if="show"
             id="modal"
             class="py-6 bg-white rounded-[8px] shadow-xl transform transition-all sm:w-full sm:mx-auto"
             :class="maxWidthClass + ' ' + contentPaddingX ">
          <div class="flex justify-between items-center pb-6" :class="contentPaddingX !== 'px-6' ? 'px-6 ': ''  ">
            <p class="text-2xl font-[584]">{{ props.modalTitle }}</p>
            <IconX @click="$emit('update:show', false)" class="cursor-pointer" color="#86949E"/>
          </div>
          <slot />
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import {computed, onMounted, onUnmounted, watch} from 'vue';
import {IconX} from '@tabler/icons-vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  maxWidth: {
    type: String,
    default: '2xl',
  },

  modalTitle: {
    type: String,
    default: 'Modal Title',
  },

  closeOnOutsideClick: {
    type: Boolean,
    default: true
  },

  closeable: {
    type: Boolean,
    default: true,
  },

  contentPaddingX: {
    type: String,
    default: 'px-6'
  }
});

const emit = defineEmits(['close', 'update:show', 'clickedApproveButton']);

watch(
  () => props.show,
  (newValue, oldValue) => {
    if (newValue) {
      // New modal is opened
      if (oldValue) {
        // Close the previous modal
        emit('update:show', false);
      }
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = null;
    }
  }
);

const close = () => {
  if (props.closeable) {
    emit('close');
  }
};

const closeOnEscape = (e) => {
  if (e.key === 'Escape' && props.show) {
    close();
  }
};

onMounted(() => document.addEventListener('keydown', closeOnEscape));

onUnmounted(() => {
  document.removeEventListener('keydown', closeOnEscape);
  document.body.style.overflow = null;
});

const maxWidthClass = computed(() => {
  return {
    'sm': 'sm:max-w-sm',
    'md': 'sm:max-w-md',

    'lg': 'sm:max-w-[480px]',
    'xl': 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
  }[props.maxWidth];
});
</script>