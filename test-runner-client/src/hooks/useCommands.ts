import { useEffect, useReducer } from 'react';

import { apiConnector } from '../core/api.connector';
import { Command } from '../core/api.types';
import { wsConnector } from '../core/tRPC.provider';

type ReducerAction =
  | { type: 'SET'; commands: Command[] }
  | { type: 'CREATED'; command: Command }
  | { type: 'UPDATED'; command: Command }
  | { type: 'DELETED'; id: string };

const commandsReducer = (state: Command[], action: ReducerAction) => {
  switch (action.type) {
    case 'SET':
      return action.commands;
    case 'CREATED':
      return state.find((s) => s.id === action.command.id) ? state : [...state, action.command];
    case 'UPDATED':
      return state.map((s) => (s.id === action.command.id ? action.command : s));
    case 'DELETED':
      return state.filter((s) => s.id !== action.id);
    default:
      console.error('Unexpected action type');
      return state;
  }
};

export const useCommands = () => {
  const [commands, dispatch] = useReducer(commandsReducer, []);
  const {
    data: commandsLoaded,
    isLoading: commandsLoading,
    isError: commandsError,
  } = apiConnector.command.getCommands.useQuery();

  useEffect(() => {
    if (commandsLoaded) {
      dispatch({ type: 'SET', commands: commandsLoaded });
    }
  }, [commandsLoaded, dispatch]);

  useEffect(() => {
    const ref = wsConnector.command.watchCommands.subscribe(undefined, {
      onData: (commandEvent) => {
        switch (commandEvent.type) {
          case 'create':
            dispatch({ type: 'CREATED', command: commandEvent.command });
            break;
          case 'update':
            dispatch({ type: 'UPDATED', command: commandEvent.command });
            break;
          case 'delete':
            dispatch({ type: 'DELETED', id: commandEvent.command.id });
            break;
        }
      },
    });

    return () => {
      ref.unsubscribe();
    };
  }, [dispatch]);

  return { commands, commandsLoading, commandsError };
};
