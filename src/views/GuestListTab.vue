<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Guest List</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">

      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Guest List</ion-title>
        </ion-toolbar>
      </ion-header>

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

      <ion-list v-if="data.invitations">
        <ion-item v-for="invitation in data.invitations.data" :key="invitation.id">
          <ion-label>
            {{ invitation.name }}
          </ion-label>
        </ion-item>
      </ion-list>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRefresher, IonRefresherContent, IonSkeletonText,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import {gql, useQuery} from "@urql/vue";

const ALL_INVITATIONS_QUERY = gql`
query GetAllInvitations {
  invitations {
    paginatorInfo {
        hasMorePages
        currentPage
    }
    data {
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
  },
  setup() {
    const result = useQuery({
      query: ALL_INVITATIONS_QUERY
    });

    return {
      data: result.data,
      isLoading: result.fetching,
      error: result.error,
      doRefresh(e: any) {
        result.executeQuery({
          requestPolicy: 'network-only',
        });
        e.detail.complete();
      }
    }
  }
});
</script>
