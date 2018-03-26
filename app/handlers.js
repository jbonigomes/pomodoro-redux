define(['app/helpers', 'app/rules', 'app/actions'], (helpers, rules, actions) => ({
  addSessionLength (store) {
    if (rules.canAddSessionLength(store.getState())) {
      store.dispatch(actions.addSessionLength());

      if (rules.isSession(store.getState())) {
        store.dispatch(actions.setTime(store.getState().sessionLength * 60));
      }
    }
  },

  subtractSessionLength (store) {
    if (rules.canSubtractSessionLength(store.getState())) {
      store.dispatch(actions.subtractSessionLength());

      if (rules.isSession(store.getState())) {
        store.dispatch(actions.setTime(store.getState().sessionLength * 60));
      }
    }
  },

  addBreakLength (store) {
    if (rules.canAddBreakLength(store.getState())) {
      store.dispatch(actions.addBreakLength());

      if (!rules.isSession(store.getState())) {
        store.dispatch(actions.setTime(store.getState().breakLength * 60));
      }
    }
  },

  subtractBreakLength (store) {
    if (rules.canSubtractBreakLength(store.getState())) {
      store.dispatch(actions.subtractBreakLength());

      if (!rules.isSession(store.getState())) {
        store.dispatch(actions.setTime(store.getState().breakLength * 60));
      }
    }
  },

  togglePaused (store) {
    if (!rules.isPaused(store.getState())) {
      clearInterval(store.getState().intervalID);
      store.dispatch(actions.setIntervalID(null));
    }
    else {
      const intervalID = setInterval(() => {
        if (rules.canSubtractTime(store.getState())) {
          store.dispatch(actions.setTime(store.getState().time - 1));
        }
        else {
          helpers.playSound();

          if (rules.isSession(store.getState())) {
            store.dispatch(actions.setName('Break!'));
            store.dispatch(actions.setTime(store.getState().breakLength * 60));
          }
          else {
            store.dispatch(actions.setName('Session'));
            store.dispatch(actions.setTime(store.getState().sessionLength * 60));
          }
        }
      }, 1000);

      store.dispatch(actions.setIntervalID(intervalID));
    }
  },
}));
