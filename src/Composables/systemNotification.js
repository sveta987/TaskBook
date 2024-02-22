import {reactive, toRefs} from 'vue';

const notificationState = reactive({
  notificationMessage: null,
  notificationType: null,
  showNotification: false,
  hasUndoFunction: true,
  timeout: null,
  heading: null
});
let timeoutForHideNotification = null;

export const showNotification = (message, type, undoFunction, timeout, heading) => {
  clearInterval(timeoutForHideNotification);
  notificationState.showNotification = true;
  notificationState.notificationMessage = message;
  notificationState.notificationType = type;
  notificationState.hasUndoFunction = undoFunction;
  notificationState.timeout = timeout;
  notificationState.heading = heading;
  timeoutForHideNotification = setInterval(hideNotification, notificationState.timeout);
};
export const hideNotification = () => {
  notificationState.timeout = null;
  notificationState.showNotification = false;
  notificationState.notificationMessage = null;
  notificationState.notificationType = null;
  notificationState.hasUndoFunction = true;
};

export default function useSystemNotification () {
  return { ...toRefs(notificationState) };
}