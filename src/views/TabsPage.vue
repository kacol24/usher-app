<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/guest-list">
          <ion-label>Guest List</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/dashboard">
          <ion-label>Dashboard</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {IonLabel, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs} from '@ionic/vue';

export default defineComponent({
  name: 'TabsPage',
  components: {IonLabel, IonTabs, IonTabBar, IonTabButton, IonPage, IonRouterOutlet}
});
</script>
