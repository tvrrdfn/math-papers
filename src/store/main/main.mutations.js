import {main as types} from '@/store/mutation-types';

export const mutations = {
    [types.SET_MAIN_ASIDE_PACKUP](state, status) {
        state.mainAsideIsPackup = status;
    }
}