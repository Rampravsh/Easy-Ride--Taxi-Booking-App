import { useDispatch, useSelector, useStore } from 'react-redux';
import type { RootState, AppDispatch, AppStore } from './store';

/**
 * Custom strictly-typed React-Redux dispatch hook helper.
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Custom strictly-typed React-Redux selector hook helper.
 */
export const useAppSelector = <TSelected>(
  selector: (state: RootState) => TSelected
) => useSelector<RootState, TSelected>(selector);

/**
 * Custom strictly-typed React-Redux store hook helper.
 */
export const useAppStore = () => useStore<AppStore>();
