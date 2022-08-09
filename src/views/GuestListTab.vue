<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button id="filter-group">
            Groups
          </ion-button>
          <ion-popover trigger="filter-group" trigger-action="click">
            <ion-content class="ion-padding" scroll-y="false">Hello World!</ion-content>
          </ion-popover>
        </ion-buttons>
        <ion-title>Guest List</ion-title>
        <ion-buttons slot="end">
          <ion-button>
            <ion-icon slot="icon-only" :icon="icons.qrCode"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <form action="">
          <ion-searchbar animated
                         inputmode="search"
                         show-cancel-button="focus"
                         show-clear-button="focus"
                         type="search"
                         v-model="search"/>
        </form>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
        <ion-refresher-content/>
      </ion-refresher>

      <ion-list v-if="isLoading">
        <ion-item v-for="invitation in Array(10)" :key="invitation">
          <ion-label>
            <ion-skeleton-text animated/>
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-list v-else>
        <ion-item-group v-for="invitationRow in invitations" :key="invitationRow.key">
          <ion-item-divider sticky>
            <ion-label>
              {{ invitationRow.key }}
            </ion-label>
          </ion-item-divider>
          <ion-item v-for="invitation in invitationRow.invitations" :key="invitation.id" lines="full">
            <ion-label>
              {{ invitation.full_name }}
            </ion-label>
          </ion-item>
        </ion-item-group>
      </ion-list>

    </ion-content>
  </ion-page>
</template>

<script>
import {computed, defineComponent, onMounted, reactive, ref} from 'vue';
import {qrCodeSharp} from 'ionicons/icons';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader, IonIcon,
  IonItem, IonItemDivider, IonItemGroup,
  IonLabel,
  IonList,
  IonPage, IonPopover,
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
    full_name
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
    IonSearchbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonPopover,
    IonItemGroup,
    IonItemDivider
  },
  setup() {
    const search = ref('');
    const invitations = reactive([]);
    const rawInvitations = reactive([]);

    const {fetching, executeQuery, data} = useQuery({
      query: ALL_INVITATIONS_QUERY,
      pause: true
    });

    const filteredInvitations = computed(() => {
      if (!search.value) {
        return invitations;
      }

      let filtered = rawInvitations.filter(invitation => {
        return invitation.name.toLowerCase().includes(search.value.toLowerCase());
      });

      let last = null;
      let grouped = [];
      filtered.forEach(invitation => {
        if (!last || last !== invitation.name[0].toUpperCase()) {
          last = invitation.name[0].toUpperCase();
          grouped.push({
            key: invitation.name[0].toUpperCase(),
            invitations: []
          });
        }

        grouped[grouped.length - 1].invitations.push(invitation);
      });

      return grouped;
    });

    onMounted(async () => {
      await executeQuery();
      data.value.invitations.forEach(invitation => {
        rawInvitations.push(invitation);
      });

      let last = null;
      rawInvitations.forEach(invitation => {
        if (!last || last !== invitation.name[0].toUpperCase()) {
          last = invitation.name[0].toUpperCase();
          invitations.push({
            key: invitation.name[0].toUpperCase(),
            invitations: []
          });
        }

        invitations[invitations.length - 1].invitations.push(invitation);
      });
    });

    function doRefresh(e) {
      executeQuery({
        requestPolicy: 'network-only'
      });
      e.detail.complete();
    }

    return {
      icons: {
        qrCode: qrCodeSharp
      },
      invitations: filteredInvitations,
      search,
      isLoading: fetching,
      doRefresh
    };
  }
});
</script>
