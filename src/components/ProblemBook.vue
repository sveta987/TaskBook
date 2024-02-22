<template>
  <div class="flex gap-2 items-start !py-12 h-screen justify-center !bg-white overflow-x-visible">
    <div v-for="chapter in chapters" class="h-full overflow-x-visible">
      <ColumnForProblemBook :chapter="chapter" :chapters="chapters" :tasks="tasksData.filter(task => task.chapter_id === chapter.id)" v-model:idGlobal="idGlobal" v-model:controlOnStart="controlOnStart"></ColumnForProblemBook>
    </div>
  </div>
  <SystemNotification
    :show="showNotification"
    :message="notificationMessage"
    :has-undo-function="hasUndoFunction"
    :typeOfNotification="notificationType"
    :heading="heading"
    class="z-[150]"
    @update:show="hideNotification" />
</template>

<script setup>
import { onMounted, ref} from 'vue';
import ColumnForProblemBook from './ColumnForProblemBook.vue';
import useTasks, {getTasks} from '../Composables/tasks.js';
import SystemNotification from './SystemNotification.vue';
import useSystemNotification, {hideNotification} from '../Composables/systemNotification.js';

let idGlobal = 8;

const chapters = ref([
  {id: 1, name:'На согласовании', color:'FF99E9'},
  {id: 2, name:'Новые' , color:'66B8FF'},
  {id: 3, name:'В процессе' , color:'FFD466'},
  {id: 4, name:'Готово', color:'53C666'},
  {id: 5, name:'Доработать', color:'F76E85'}
]);
const {tasksData} = useTasks();
const { hasUndoFunction, notificationType, notificationMessage, showNotification, heading } = useSystemNotification();


let controlOnStart = true;



onMounted(async () => {
  await getTasks();
})
</script>

<style scoped></style>
