// import { Component } from 'react';
import { useState, useEffect, ChangeEvent } from 'react';

// import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import CardList from './components/card-list/card-list.component';
import SearchBox from './components/search-box/search-box.component';

import { getData } from './utils/data.utils';
import './App.css';

export type Monster = {
  id: string;
  name: string;
  email: string;
};

const App = () => {
  const [searchField, setSearchField] = useState('');
  const [filteredMonsters, setFilteredMonsters] = useState<Monster[]>([]);

  const {
    data: monsters,
    isLoading,
    error,
  } = useQuery<Monster[]>({
    queryKey: ['users'],
    queryFn: async (): Promise<Monster[]> => {
      return await getData<Monster[]>(
        'https://jsonplaceholder.typicode.com/users'
      );
    },
  });

  if (error) {
    console.error('Error fetching data:', error.message);
  }

  useEffect(() => {
    if (monsters) {
      const newFilteredMonsters = monsters.filter((monster: Monster) =>
        monster.name.toLowerCase().includes(searchField.toLowerCase())
      );

      setFilteredMonsters(newFilteredMonsters);
    }
  }, [monsters, searchField]);

  const onSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const searchFieldString = event.target.value.toLocaleLowerCase();
    setSearchField(searchFieldString);
  };

  return isLoading ? (
    <h2>Loading...</h2>
  ) : error ? (
    <h2>Error loading monsters</h2>
  ) : (
    <div className="App">
      <SearchBox
        className="monsters-search-box"
        onChangeHandler={onSearchChange}
        placeholder="search monsters"
      />
      <CardList monsters={filteredMonsters} />
    </div>
  );
};

export default App;

// class App extends Component {
//   constructor() {
//     super();

//     this.state = {
//       monsters: [],
//       searchField: '',
//     };

//     // console.log('constructor');
//   }

//   componentDidMount() {
//     // fetch('https://jsonplaceholder.typicode.com/users').then((response) =>
//     //   response.json().then((users) =>
//     //     this.setState(
//     //       () => {
//     //         return { monsters: users };
//     //       },
//     //       () => {
//     //         console.log(this.state);
//     //       }
//     //     )
//     //   )
//     // );
//     // console.log('componentDidMount');

//     axios.get('https://jsonplaceholder.typicode.com/users').then((response) => {
//       this.setState(() => {
//         return { monsters: response.data };
//       });
//     });
//   }

//   onSearchChange = (event) => {
//     this.setState({ searchField: event.target.value });
//   };

//   render() {
//     // console.log('render');
//     const { monsters, searchField } = this.state;
//     const { onSearchChange } = this;

//     const filteredMonsters = monsters.filter((monster) =>
//       monster.name.toLowerCase().includes(searchField.toLowerCase())
//     );

//     return (
//       <div className="App">
//         <h1 className="app-title">Monsters Rolodex</h1>

//         <SearchBox
//           className="monsters-search-box"
//           onChangeHandler={onSearchChange}
//           placeholder="search monsters"
//         />
//         <CardList monstersProp={filteredMonsters} />
//       </div>
//     );
//   }
// }
