<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/guest-list">
          <ion-icon :icon="triangle" />
          <ion-label>Guest List</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/dashboard">
          <ion-icon :icon="ellipse" />
          <ion-label>Dashboard</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { ellipse, square, triangle } from 'ionicons/icons';
import {gql, useQuery} from "@urql/vue";


export default defineComponent({
  name: 'TabsPage',
  components: { IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage, IonRouterOutlet },
  setup() {
    const result = useQuery({
      query: `
        {
          invitations {
            data {
              guest_code
              name
              phone
              guests
              seating {
                name
              }
              attendance {
                sequence
                sequence_group
                serial_number
                created_at
              }
            }
          }
        }
      `
    });

    return {
      result,

      ellipse,
      square,
      triangle,
    }
  }
});
</script>
