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
        <ion-item color="primary" lines="full" v-for="(name, code) in usherList" :key="code">
          <ion-thumbnail slot="start">
            {{ code }}
          </ion-thumbnail>
          <ion-label>{{ name }}</ion-label>
          <ion-radio slot="end" color="light" :value="code"></ion-radio>
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
  alertController,
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

    async function handleSave() {
      const alert = await alertController.create({
        header: 'Login as ' + state.usherList[sequenceGroup.value] + '?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'OK',
            role: 'confirm',
            handler: () => {
              state.sequenceGroup = sequenceGroup.value;
              router.replace('/');
            }
          }
        ]
      });

      await alert.present();
    }

    return {
      sequenceGroup,
      handleChange,
      handleSave,
      usherList: state.usherList
    };
  }
};
</script>
