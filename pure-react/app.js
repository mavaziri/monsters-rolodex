const App = () => {
  return React.createElement('div', {}, [
    React.createElement('h1', { class: 'title' }, 'React is rendered'),
  ]);
};

// ReactDOM.render(
//   React.createElement(App),
//   document.getElementById('root')
// );

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(App));
