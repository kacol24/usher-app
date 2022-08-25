<template>
  <ion-app>
    <ion-router-outlet/>
  </ion-app>
</template>

<script>
import {IonApp, IonRouterOutlet} from '@ionic/vue';
import {defineComponent, onMounted, provide} from 'vue';
import store from '@/store';
import {useQuery} from '@urql/vue';
import {ALL_INVITATIONS_QUERY} from '@/graphql/queries';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet
  },
  setup() {
    provide('store', store);

    const {executeQuery, data: response} = useQuery({
      query: ALL_INVITATIONS_QUERY
    });

    store.state.isLoading = true;
    onMounted(async () => {
      if (!store.state.invitations.length) {
        await executeQuery();
        store.state.invitations = response.value.invitations;
      }
      store.state.isLoading = false;
    });
  }
});
</script>
