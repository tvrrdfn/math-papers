import * as actions from './main.actions';
import * as mutations from './main.mutations';

const state = {
    mainAsideIsPackup: false
};

const getters = {
    mainAsideIsPackup: state => state.mainAsideIsPackup
};

export default {
    namespaced: true,
    state,
    getters,
    ...actions,
    ...mutations
};
