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
          :is-open="store.state.isLoading"/>
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
      <ion-toolbar class="ion-padding-vertical" style="padding-bottom: 16px;">
        <ion-button expand="block" :color="checkInButton[confirmCheckIn].color"
                    class="ion-padding-horizontal"
                    ref="btnProgress"
                    size="large" mode="ios"
                    @click="handleCheckIn">
          {{ checkInButton[confirmCheckIn].text }}
        </ion-button>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<style scoped>
.btn-progress::part(native):before {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--ion-color-success-shade);
  transform: scaleX(1);
  transition: transform 3s linear;
  transform-origin: center left;
}

.btn-progress--start::part(native):before {
  transform: scaleX(0);
}
</style>

<script>
import {defineComponent, inject, ref} from 'vue';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonLoading,
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
    IonLoading,
    IonButton
  },

  setup() {
    const store = inject('store');
    const btnProgress = ref();
    const checkInButton = ref([
      {
        color: 'primary',
        text: 'CHECK IN'
      },
      {
        color: 'success',
        text: 'CONFIRM CHECK IN'
      }
    ]);

    const confirmCheckIn = ref(0);
    store.state.isLoading = false;

    async function handleCheckIn() {
      confirmCheckIn.value++;

      btnProgress.value.$el.classList.add('btn-progress');
      setTimeout(() => {
        btnProgress.value.$el.classList.add('btn-progress--start');
      }, 1);

      if (confirmCheckIn.value < 2) {
        setTimeout(() => {
          btnProgress.value.$el.classList.remove('btn-progress', 'btn-progress--start');
          confirmCheckIn.value = 0;
        }, 3000);
      } else {
        store.state.isLoading = true;
        confirmCheckIn.value = 0;
        btnProgress.value.$el.classList.remove('btn-progress', 'btn-progress--start');
        setTimeout(() => store.state.isLoading = false, 1000);
      }
    }

    return {
      icons: {
        arrowForwardCircle
      },

      handleCheckIn,
      store,
      confirmCheckIn,

      btnProgress,
      checkInButton
    };
  }
});
</script>
