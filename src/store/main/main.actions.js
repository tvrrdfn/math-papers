import {main as types} from '@/store/mutation-types';

export const actions = {
    /**
     * 设置主页左侧边栏收起状态
     */
    setMainAsidePackup({commit, state}) {
        commit(types.SET_MAIN_ASIDE_PACKUP, !state.mainAsideIsPackup);
    },

    /**
     * 存储所选题型
     * @param {Array} questions
     */
    setQuestions({commit}, questions) {
        commit(types.SET_QUESTIONS, questions);
    }
}