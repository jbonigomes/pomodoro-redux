const dependencies = [
  'app/rules',
  'app/helpers',
  'app/handlers',
  'app/reducers',
];

requirejs(dependencies, (rules, helpers, handlers, reducers) => {
  const initialState = {
    time: 25 * 60,
    breakLength: 5,
    sessionLength: 25,

    intervalID: null,

    name: 'Session',
  };

  const store = Redux.createStore(reducers.pomodoro, initialState);

  document.addEventListener('click', (e) => {
    const classToAction = {
      'toggle-paused': () => handlers.togglePaused(store),
      'add-break-length': () => handlers.addBreakLength(store),
      'add-session-length': () => handlers.addSessionLength(store),
      'subtract-break-length': () => handlers.subtractBreakLength(store),
      'subtract-session-length': () => handlers.subtractSessionLength(store),
    };

    if (classToAction[e.target.className]) {
      classToAction[e.target.className]();
    }
  });

  const render = () => {
    const state = store.getState();

    document.querySelector('.title').innerHTML = state.name;
    document.querySelector('.b-len').innerHTML = state.breakLength;
    document.querySelector('.s-len').innerHTML = state.sessionLength;
    document.querySelector('.timer').innerHTML = helpers.formatTime(state.time);

    if (rules.isSession(state)) {
      const perc = helpers.formatPercentage(state.time, state.sessionLength);

      document.querySelector('.cover').style.height = perc;
      document.querySelector('.background').classList.remove('red');
      document.querySelector('.background').classList.add('green');
    }
    else {
      const perc = helpers.formatPercentage(state.time, state.breakLength);

      document.querySelector('.cover').style.height = perc;
      document.querySelector('.background').classList.remove('green');
      document.querySelector('.background').classList.add('red');
    }
  };

  render();
  store.subscribe(render);
});
