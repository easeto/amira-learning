const logger = (store) => (next) => (action) => {
  console.group(action.type);
  console.log('The action:', action);
  const currentState = store.getState();
  console.log("current state", currentState);
  let returnValue = next(action);
  console.log('next state', store.getState());
  console.groupEnd();
  return returnValue;
}

export default logger;