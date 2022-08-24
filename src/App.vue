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
import {GROUPED_INVITATIONS_QUERY} from '@/graphql/queries';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet
  },
  setup() {
    provide('store', store);

    const {executeQuery, data: response} = useQuery({
      query: GROUPED_INVITATIONS_QUERY
    });

    store.state.isLoading = true;
    onMounted(async () => {
      if (!store.state.invitations.length) {
        await executeQuery();
        response.value.groupedInvitations.forEach(invitation => {
          store.state.invitations.push(invitation);
        });
      }
      store.state.isLoading = false;
    });
  }
});
</script>
