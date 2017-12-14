import {main as types} from '@/store/mutation-types';

export const actions = {
    setMainAsidePackup({commit, state}) {
        commit(types.SET_MAIN_ASIDE_PACKUP, !state.mainAsideIsPackup);
    }
}