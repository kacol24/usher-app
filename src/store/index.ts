import {reactive} from 'vue';
import {useLocalStorage} from '@vueuse/core/index';

const state = reactive({
  invitations: [],
  isLoading: false,
  sequenceGroup: useLocalStorage('sequence_group', '')
});

export default {
  state
};
