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
            S
          </ion-thumbnail>
          <ion-label>Sutrisno</ion-label>
          <ion-radio slot="end" color="light" value="S"></ion-radio>
        </ion-item>
        <ion-item color="primary" lines="full">
          <ion-thumbnail slot="start">
            Z
          </ion-thumbnail>
          <ion-label>Zella</ion-label>
          <ion-radio slot="end" color="light" value="Z"></ion-radio>
        </ion-item>
        <ion-item color="primary" lines="full">
          <ion-thumbnail slot="start">
            P
          </ion-thumbnail>
          <ion-label>Peter</ion-label>
          <ion-radio slot="end" color="light" value="P"></ion-radio>
        </ion-item>
        <ion-item color="primary" lines="full">
          <ion-thumbnail slot="start">
            V
          </ion-thumbnail>
          <ion-label>Verly</ion-label>
          <ion-radio slot="end" color="light" value="V"></ion-radio>
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
