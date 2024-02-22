<template>
  <div class="py-2 text-center text-sm leading-[17.5px] font-[584] rounded-t-lg overflow-x-visible"
       :style="{background: '#' + chapter.color}">
    {{ chapter.name }}
  </div>
  <div class="w-[180px] bg-[#F7F7F7] border border-[#E3E5E8] rounded-b-lg h-full overflow-y-auto overflow-x-visible scrollbar">
    <div class="bg-[#F7F7F7] w-full flex flex-col ">
      <draggable
        class=" dragArea list-group w-full "
        :class="'task_' + chapter.id"
        :list="localTasks"
        :clone="clone"
        :group="{ name: 'tasks', pull: pullFunction }"
        @start="start"
        @end="end"
        item-key="id"
        :id="chapter.id"
      >
        <template #item="{ element }">
          <div :id="element.id">

            <div v-if="!(isTaskEditing && selectedTaskForDeleteOrEdit.id === element.id)"
                 class="py-1 pl-2 mr-4 relative">
              <div
                class="list-group-item bg-white border border-[#C4CAD4] rounded-[8px] py-2 pl-2 pr-6 hover:my-shadow break-all">
                {{ element.task }}
              </div>
              <div class="absolute right-1 top-0 cursor-pointer">
                <Dropdown :close-on-inside-click="true" align="left" :content-classes="['px-2.5', 'py-2', 'bg-white']">
                  <template #trigger>
                    ...
                  </template>
                  <template #content>
                      <div class="flex items-center gap-2 py-[5px]" @click="editTask(element)">
                        <IconPencilMinus />
                        Редактировать
                      </div>
                      <div class="flex items-center gap-2 py-[5px]" @click="openModalForDeleteTask(element)">
                        <IconTrash />
                        Удалить
                      </div>
                  </template>
                </Dropdown>
              </div>
            </div>
            <div v-else class="mt-2 py-1 ml-2 mr-4 rounded-[4px] border border-[#3D86F4] bg-white p-2">
              <div class="flex items-start">
                  <textarea
                    ref="textarea"
                    v-model="selectedTaskForDeleteOrEdit.task"
                    class="resize-none ml-2 ring-0 outline-none"
                    autocomplete="on"
                    placeholder="Введите текст..."
                  />
                <div class="flex flex-col">
                  <div class="p-[5px] cursor-pointer">
                    <IconX color="#F53D5C"
                           @click="()=> {isTaskEditing = !isTaskEditing; selectedTaskForDeleteOrEdit = null}" />
                  </div>
                  <div class="p-[5px] cursor-pointer">
                    <IconCheck color="#22C33D" @click="saveEditsChanges" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </template>
      </draggable>
      <div ref="newTaskSection" class="mt-2 py-1 pl-2 mr-4 rounded-[4px]">
        <div v-if="isOpenTextAreaForNewTask" class="border border-[#3D86F4] bg-white rounded-[4px] p-2">
          <div class="flex items-start">
           <textarea
             ref="textarea"
             v-model="newTask.task"
             class="resize-none  ring-0 outline-none"
             autocomplete="on"
             placeholder="Введите текст..."
           />
            <div class="flex flex-col">
              <div class="p-[5px] cursor-pointer">
                <IconX color="#F53D5C"
                       @click="()=> {isOpenTextAreaForNewTask = !isOpenTextAreaForNewTask; newTask.task = ''}" />
              </div>
              <div class="p-[5px] cursor-pointer">
                <IconCheck color="#22C33D" @click="createTask" />
              </div>
            </div>
          </div>
        </div>
        <div v-else class="flex items-center gap-1 text-sm text-[#3D86F4]"
             @click="isOpenTextAreaForNewTask = !isOpenTextAreaForNewTask">
          <IconPlus />
          Добавить
        </div>
      </div>
    </div>
  </div>
  <modal
    v-model:show="isOpenDeleteModal"
    modalTitle="Удалить задачу?"
    maxWidth="lg"
  >
    <div class="text-sm text-[#1C2530] flex flex-col gap-6">
      <div>
        {{ selectedTaskForDeleteOrEdit.task }}
      </div>
      <div class="flex items-center gap-4">
        <button class="w-full text-center py-[9px] border border-[#C4CAD4] rounded-[4px]" @click="deleteTask">
          Удалить
        </button>
        <button class="w-full text-center py-[9px] border border-[#C4CAD4] rounded-[4px]"
                @click="()=> {isOpenDeleteModal = !isOpenDeleteModal; selectedTaskForDeleteOrEdit = null}">
          Отменить
        </button>
      </div>
    </div>
  </modal>
</template>

<script setup>
import draggable from 'vuedraggable';
import {v4 as uuidv4} from 'uuid';
import {ref, watch} from 'vue';
import {addTaskToTasksData, removeTaskFromTasksData, updateTask} from '../Composables/tasks.js';
import axios from 'axios';
import Dropdown from './Dropdown.vue';
import {IconTrash, IconPencilMinus, IconPlus, IconX, IconCheck} from '@tabler/icons-vue';
import Modal from './Modal.vue';
import {showNotification} from '../Composables/systemNotification.js';

const props = defineProps({
  chapter: {
    type: Object,
    required: true
  },
  tasks: {
    type: Array,
    required: false,
  },
  idGlobal: {
    type: Number,
  },
  controlOnStart: {
    type: Boolean,
  },
  chapters: {
    type: Array,
  }
});

const localTasks = ref(props.tasks);
const isOpenDeleteModal = ref(false);
const selectedTaskForDeleteOrEdit = ref(null);
const isOpenTextAreaForNewTask = ref(false);
const isTaskEditing = ref(false);
const tasksBottomPosition = ref(0);
const newTaskSection = ref(null);
const newTask = ref({
  task: '',
  chapter_id: props.chapter.id,
  id: uuidv4(),
});

watch(() => props.tasks, () => {
  localTasks.value = props.tasks;
});
const emit = defineEmits(['update:idGlobal', 'update:controlOnStart',]);

const clone = ({ name }) => {
  const clonedObject = { name, id: props.idGlobal };

  emit('update:idGlobal', props.idGlobal + 1);
  return clonedObject;
};
const pullFunction = () => {
  return props.controlOnStart ? 'clone' : true;
};

const start = ({ originalEvent }) => {
  emit('update:controlOnStart', originalEvent.ctrlKey);
};

const end = async (element) => {
  try {
    let response = await axios.put(`http://localhost:3000/tasks/${element.clone.id}`,
      { ...props.tasks.find(task => task.id === element.clone.id), ...{ 'chapter_id': Number(element.to.id) } });
    updateTask(element.clone.id, { 'chapter_id': Number(element.to.id) });
    showNotification(response.data.task, 'success', false, 5000, `Задача перенесена в «${props.chapters.find(chapter => chapter.id === element.to.id).name}» `);
  } catch (error) {
    console.error('Error updating data:', error);
    showNotification(error.message, 'error', false, 5000, `Error`);
  }

};

const editTask = (task) => {
  selectedTaskForDeleteOrEdit.value = task;
  isTaskEditing.value = !isTaskEditing.value;
};

const saveEditsChanges = () => {
  axios.put(`http://localhost:3000/tasks/${selectedTaskForDeleteOrEdit.value.id}`, selectedTaskForDeleteOrEdit.value).then(() => {
    updateTask(selectedTaskForDeleteOrEdit.value.id, { 'task': selectedTaskForDeleteOrEdit.value.task });
    showNotification(selectedTaskForDeleteOrEdit.value.task, 'success', false, 5000, `Задача отредактирована`);
    selectedTaskForDeleteOrEdit.value = null;
    isTaskEditing.value = !isTaskEditing.value;
  })
    .catch((error) => {
      showNotification(error.message, 'error', false, 5000, `Error`);
    });
};

const openModalForDeleteTask = (task) => {
  selectedTaskForDeleteOrEdit.value = task;
  isOpenDeleteModal.value = !isOpenDeleteModal.value;
};

const deleteTask = () => {
  axios.delete(`http://localhost:3000/tasks/${selectedTaskForDeleteOrEdit.value.id}`).then(() => {
    isOpenDeleteModal.value = !isOpenDeleteModal.value;
    removeTaskFromTasksData(selectedTaskForDeleteOrEdit.value.id);
    showNotification(selectedTaskForDeleteOrEdit.value.task, 'success', false, 5000, `Задача удалена`);
    selectedTaskForDeleteOrEdit.value = null;
  }).catch((error) => {
    showNotification(error.message, 'error', false, 5000, `Error`);
  });
};

const createTask = () => {
  axios.post('http://localhost:3000/tasks', newTask.value).then((response) => {
    isOpenTextAreaForNewTask.value = !isOpenTextAreaForNewTask.value;
    addTaskToTasksData(response.data);
    showNotification(newTask.value.task, 'success', false, 5000, `Задача создана в «${props.chapter.name}»`);
    newTask.value.task = '';
    newTask.value.id = uuidv4();
  }).catch((error) => {
    showNotification(error.message, 'error', false, 5000, `Error`);
  });
};

</script>

<style scoped>
.my-shadow {
  box-shadow: 0 8px 8px 0 #00000014;
}

.default-shadow {
  box-shadow: 0 8px 16px 0 #0000000F;
}

.scrollbar {
  overflow-x: hidden;
  overflow-y: scroll;
}

.scrollbar:hover {
  overflow-y: scroll;
}

.scrollbar::-webkit-scrollbar-track {
  -webkit-box-shadow: transparent;
  border-radius: 10px;
  background-color: transparent;
}

.scrollbar:hover::-webkit-scrollbar-track {
  background-color: transparent;
}

.scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: #D9D9D9;
}

.scrollbar::-webkit-scrollbar {
  width: 8px
}

.scrollbar::-webkit-scrollbar-thumb {
  cursor: pointer;
  border-radius: 10px;
  -webkit-box-shadow: transparent;
}
</style>