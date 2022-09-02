<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="secondary">
        <ion-title>
          Usher List
        </ion-title>
        <ion-buttons slot="end">
          <ion-button color="light"
                      @click="handleSave">
            Save
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content style="--background: var(--ion-color-primary)">
      <ion-radio-group :value="sequenceGroup"
                       @ionChange="handleChange">
        <ion-item color="primary" lines="full">
          <ion-thumbnail slot="start">
            B1
          </ion-thumbnail>
          <ion-label>Usher B1</ion-label>
          <ion-radio slot="end" color="secondary" value="B1"></ion-radio>
        </ion-item>
        <ion-item color="primary" lines="full">
          <ion-thumbnail slot="start">
            B2
          </ion-thumbnail>
          <ion-label>Usher B2</ion-label>
          <ion-radio slot="end" color="secondary" value="B2"></ion-radio>
        </ion-item>
        <ion-item color="primary" lines="full">
          <ion-thumbnail slot="start">
            G1
          </ion-thumbnail>
          <ion-label>Usher G1</ion-label>
          <ion-radio slot="end" color="secondary" value="G1"></ion-radio>
        </ion-item>
        <ion-item color="primary" lines="full">
          <ion-thumbnail slot="start">
            G2
          </ion-thumbnail>
          <ion-label>Usher G2</ion-label>
          <ion-radio slot="end" color="secondary" value="G2"></ion-radio>
        </ion-item>
        <ion-item color="primary" lines="full">
          <ion-thumbnail slot="start">
            B
          </ion-thumbnail>
          <ion-label>Usher B</ion-label>
          <ion-radio slot="end" color="secondary" value="B"></ion-radio>
        </ion-item>
        <ion-item color="primary" lines="full">
          <ion-thumbnail slot="start">
            G
          </ion-thumbnail>
          <ion-label>Usher G</ion-label>
          <ion-radio slot="end" color="secondary" value="G"></ion-radio>
        </ion-item>
      </ion-radio-group>
    </ion-content>
  </ion-page>
</template>

<style scoped>
ion-thumbnail {
  display: flex;
  align-items: center;
  justify-content: center;
}

ion-item {
  --ion-color-shade: var(--ion-color-light) !important;
}
</style>

<script>
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  useIonRouter
} from '@ionic/vue';
import {inject, ref} from 'vue';

export default {
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRadioGroup,
    IonItem,
    IonLabel,
    IonRadio,
    IonThumbnail,
    IonButtons,
    IonButton
  },
  setup() {
    const {state} = inject('store');
    const router = useIonRouter();

    const sequenceGroup = ref(state.sequenceGroup);

    function handleChange(e) {
      sequenceGroup.value = e.detail.value;
    }

    function handleSave() {
      state.sequenceGroup = sequenceGroup.value;
      router.replace('/');
    }

    return {
      sequenceGroup,
      handleChange,
      handleSave
    };
  }
};
</script>
