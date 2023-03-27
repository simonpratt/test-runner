import { useEffect, useReducer } from 'react';

import { apiConnector } from '../core/api.connector';
import { Job } from '../core/api.types';
import { wsConnector } from '../core/tRPC.provider';

type ReducerAction =
  | { type: 'SET'; jobs: Job[] }
  | { type: 'CREATED'; job: Job }
  | { type: 'UPDATED'; job: Job }
  | { type: 'DELETED'; id: string };

const jobsReducer = (state: Job[], action: ReducerAction) => {
  switch (action.type) {
    case 'SET':
      console.log('SETTING JOBS');
      return action.jobs;
    case 'CREATED':
      console.log('CREATING JOB');
      return state.find((s) => s.id === action.job.id) ? state : [...state, action.job];
    case 'UPDATED':
      console.log('UPDATING JOB', action);
      return state.map((s) => (s.id === action.job.id ? action.job : s));
    case 'DELETED':
      console.log('DELETING JOB', action);
      return state.filter((s) => s.id !== action.id);
    default:
      console.error('Unexpected action type');
      return state;
  }
};

export const useJobs = () => {
  const [jobs, dispatch] = useReducer(jobsReducer, []);
  const { data: jobsLoaded, isLoading: jobsLoading, isError: jobsError } = apiConnector.job.getJobs.useQuery();

  useEffect(() => {
    if (jobsLoaded) {
      dispatch({ type: 'SET', jobs: jobsLoaded });
    }
  }, [jobsLoaded, dispatch]);

  useEffect(() => {
    const ref = wsConnector.job.watchJobs.subscribe(undefined, {
      onData: (jobEvent) => {
        switch (jobEvent.type) {
          case 'create':
            dispatch({ type: 'CREATED', job: jobEvent.job });
            break;
          case 'update':
            dispatch({ type: 'UPDATED', job: jobEvent.job });
            break;
          case 'delete':
            dispatch({ type: 'DELETED', id: jobEvent.job.id });
            break;
        }
      },
    });

    return () => {
      ref.unsubscribe();
    };
  }, [dispatch]);

  return { jobs, jobsLoading, jobsError };
};
