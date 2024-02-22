import {reactive, toRefs} from 'vue';
import axios from 'axios';

const tasksState = reactive({
  tasksData: []
});

export async function getTasks () {
  await axios.get('http://localhost:3000/tasks').then((response) => {
    tasksState.tasksData = response.data;
  });
}

export function updateTask (taskId, newData) {
  tasksState.tasksData = tasksState.tasksData.map(task => {
    if(task.id === taskId) {
      return {...task, ...newData}
    }
    return task;
  })
}

export function removeTaskFromTasksData (id) {
  tasksState.tasksData = tasksState.tasksData.filter(task => task.id !== id);
}

export function addTaskToTasksData (task) {
  tasksState.tasksData.push(task);
}

export default function useTasks () {
  return { ...toRefs(tasksState) };
}