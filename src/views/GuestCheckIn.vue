<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>Guest Detail</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="ion-padding">
        <h1 class="ion-text-center ion-padding-vertical ion-margin-vertical">
          Soo Jong Kiau, Ko Nanang, Ko Ati, Ko Afo, Asong
          <small style="display: block;" class="ion-margin-top">
            [123456]
          </small>
        </h1>
        <div style="display: flex; align-items: center; justify-content: space-between;"
             class="ion-padding-top ion-margin-top">
          <div>
            Table<br>
            <h3>Andalasia</h3>
          </div>
          <div>
            Guests<br>
            <h3>Family (2)</h3>
          </div>
        </div>
      </div>
      <ion-loading
          :is-open="isLoading"/>
    </ion-content>
    <ion-footer>
      <ion-toolbar style="min-height: 120px;">
        <div class="ion-text-center">
          <h2 style="font-size: 52px;" class="ion-margin-vertical">
            A001
            <ion-text color="medium">
              <small style="display: block; font-size: 16px">
                (18:12:34)
              </small>
            </ion-text>
          </h2>
        </div>
      </ion-toolbar>
      <ion-item-sliding ref="itemSliding" class="ion-color-success" style="background-color: var(--ion-color-base)">
        <ion-item-options side="start" @ionSwipe="handleCheckIn"/>
        <ion-item color="primary">
          <ion-icon :icon="icons.arrowForwardCircle" slot="start"></ion-icon>
          <ion-label class="ion-padding-vertical">
            Swipe to Check In
          </ion-label>
        </ion-item>
      </ion-item-sliding>
    </ion-footer>
  </ion-page>
</template>

<script>
import {defineComponent, ref} from 'vue';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel, IonLoading,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar
} from '@ionic/vue';

import {arrowForwardCircle} from 'ionicons/icons';

export default defineComponent({
  name: 'GuestCheckIn',
  components: {
    IonPage,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonFooter,
    IonText,
    IonItemSliding,
    IonItemOptions,
    IonItem,
    IonLabel,
    IonIcon,
    IonLoading
  },

  setup() {
    const itemSliding = ref();
    const isLoading = ref(false);

    function handleCheckIn() {
      isLoading.value = true;
      itemSliding.value.$el.closeOpened();
      setTimeout(() => isLoading.value = false, 1000);
    }

    return {
      icons: {
        arrowForwardCircle
      },

      handleCheckIn,

      itemSliding,
      isLoading
    };
  }
});
</script>
