// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react';
import {
    fetchPokemon,
    PokemonForm,
    PokemonDataView,
    PokemonInfoFallback,
    PokemonErrorBoundary,
} from '../pokemon';


function infoReducer(state, action) {
    switch (action.type) {
        case 'pending': {
            return {status: 'pending', data: null, error: null};
        }
        case 'resolved': {
            return {status: 'resolved', data: action.data, error: null};
        }
        case 'rejected': {
            return {status: 'rejected', data: null, error: action.error};
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
}

function useAsync(asyncCallback, initialState) {

    const [state, dispatch] = React.useReducer(infoReducer,
        {
            status: 'idle',
            data: null,
            error: null,
            ...initialState,
        },
    );


    React.useEffect(() => {
        async function asyncCall() {
            try {

                const data = await asyncCallback();
                if (!data) {
                    return;
                }
                // I do not like this one here, but I am forced to put it if I want to use try...except. Otherwise, with promise chaining, the functionality would make sense. See the exercise solution.
                // A workaround for this would be to add to the dispatcher the action `idle` and set it in the if above, but idle is not an action done by the user, so I would not add it.
                dispatch({type: 'pending', data});
                dispatch({type: 'resolved', data});
            } catch (error) {
                dispatch({type: 'rejected', error});
            }
        }

        asyncCall();

    }, [asyncCallback])

    return state;
}


function PokemonInfo({pokemonName}) {


    const initialState = {
        status: pokemonName ? 'pending' : 'idle',
    };

    const asyncFetch = React.useCallback(() => {
        if (!pokemonName) {
            return;
        } else return fetchPokemon(pokemonName);
    }, [pokemonName])


    const state = useAsync(asyncFetch, initialState);


    const {data: pokemon, status, error} = state;

    switch (status) {
        case 'idle':
            return <span>Submit a pokemon</span>;
        case 'pending':
            return <PokemonInfoFallback name={pokemonName}/>;
        case 'rejected':
            throw error;
        case 'resolved':
            return <PokemonDataView pokemon={pokemon}/>;
        default:
            throw new Error('This should be impossible');
    }
}

function App() {
    const [pokemonName, setPokemonName] = React.useState('');

    function handleSubmit(newPokemonName) {
        setPokemonName(newPokemonName);
    }

    function handleReset() {
        setPokemonName('');
    }

    return (
        <div className="pokemon-info-app">
            <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit}/>
            <hr/>
            <div className="pokemon-info">
                <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
                    <PokemonInfo pokemonName={pokemonName}/>
                </PokemonErrorBoundary>
            </div>
        </div>
    );
}

function AppWithUnmountCheckbox() {
    const [mountApp, setMountApp] = React.useState(true);
    return (
        <div>
            <label>
                <input
                    type="checkbox"
                    checked={mountApp}
                    onChange={e => setMountApp(e.target.checked)}
                />{' '}
                Mount Component
            </label>
            <hr/>
            {mountApp ? <App/> : null}
        </div>
    );
}

export default AppWithUnmountCheckbox;
