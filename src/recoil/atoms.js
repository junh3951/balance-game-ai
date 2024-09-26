// src/recoil/atoms.js

import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'
const { persistAtom } = recoilPersist()

export const userNameState = atom({
	key: 'userNameState',
	default: '',
	effects_UNSTABLE: [persistAtom],
})

export const participantsState = atom({
	key: 'participantsState',
	default: [],
	effects_UNSTABLE: [persistAtom],
})

export const roomDataState = atom({
	key: 'roomDataState',
	default: null,
	effects_UNSTABLE: [persistAtom],
})

export const selectedCategoriesState = atom({
	key: 'selectedCategoriesState',
	default: [],
	effects_UNSTABLE: [persistAtom],
})

export const balanceGameQuestionState = atom({
	key: 'balanceGameQuestionState',
	default: {
		question: '',
		option1: '',
		option2: '',
		example1: '',
		example2: '',
	},
	effects_UNSTABLE: [persistAtom],
})

export const userSelectionState = atom({
	key: 'userSelectionState',
	default: '',
	effects_UNSTABLE: [persistAtom],
})

export const selectionCountsState = atom({
	key: 'selectionCountsState',
	default: {
		option1: 0,
		option2: 0,
	},
	effects_UNSTABLE: [persistAtom],
})

export const communityCardsState = atom({
	key: 'communityCardsState',
	default: [],
	effects_UNSTABLE: [persistAtom],
})
