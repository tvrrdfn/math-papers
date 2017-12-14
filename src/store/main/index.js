import * as actions from './main.actions';
import * as mutations from './main.mutations';

const state = {
    mainAsideIsPackup: false,
    questions: null
};

const getters = {
    mainAsideIsPackup: state => state.mainAsideIsPackup,
    questions: state => state.questions
};

export default {
    namespaced: true,
    state,
    getters,
    ...actions,
    ...mutations
};
