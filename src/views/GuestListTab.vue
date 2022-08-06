<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Guest List</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <form action="">
          <ion-searchbar animated
                         inputmode="search"
                         show-cancel-button="focus"
                         show-clear-button="focus"
                         type="search"
                         v-model="search"></ion-searchbar>
        </form>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-list v-if="isLoading">
        <ion-item v-for="invitation in Array(10)" :key="invitation">
          <ion-label>
            <ion-skeleton-text animated></ion-skeleton-text>
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-list v-else>
        <ion-item v-for="invitation in invitations" :key="invitation.id">
          <ion-label>
            {{ invitation.name }}
          </ion-label>
        </ion-item>
      </ion-list>

    </ion-content>
  </ion-page>
</template>

<script>
import {computed, defineComponent, onMounted, reactive, ref} from 'vue';
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonSkeletonText,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import {gql, useQuery} from '@urql/vue';

const ALL_INVITATIONS_QUERY = gql`
query GetAllInvitations {
  invitations {
    guest_code
      name
      guests
      seating {
        name
      }
      attendance {
        serial_number
        created_at
      }
  }
}
`;

export default defineComponent({
  name: 'GuestListTab',
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonList,
    IonItem,
    IonLabel,
    IonRefresher,
    IonRefresherContent,
    IonSkeletonText,
    IonSearchbar
  },
  setup() {
    const search = ref('');
    const invitations = reactive([]);

    const {fetching, executeQuery, data} = useQuery({
      query: ALL_INVITATIONS_QUERY,
      pause: true
    });

    const filteredInvitations = computed(() => {
      if (!search.value) {
        return invitations;
      }

      return invitations.filter(invitation => {
        return invitation.name.toLowerCase().includes(search.value.toLowerCase());
      });
    });

    onMounted(async () => {
      await executeQuery();
      data.value.invitations.forEach(invitation => {
        invitations.push(invitation);
      });
    });

    function doRefresh(e) {
      executeQuery({
        requestPolicy: 'network-only'
      });
      e.detail.complete();
    }

    return {
      invitations: filteredInvitations,
      search,
      isLoading: fetching,
      doRefresh
    };
  }
});
</script>
