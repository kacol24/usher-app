<template>
  <ion-item v-if="skeleton"
            :detail="false"
            color="primary">
    <ion-thumbnail slot="start">
      <ion-skeleton-text animated style="height: 15px;"/>
    </ion-thumbnail>
    <ion-label class="ion-padding-vertical">
      <div style="display: flex;align-items: center;justify-content: space-between;">
        <h3>
          <ion-skeleton-text animated style="width: 60px;"/>
        </h3>
        <ion-note>
          <ion-skeleton-text animated style="width: 110px;"/>
        </ion-note>
      </div>
      <h2 class="ion-text-wrap ion-padding-vertical" style="margin: 0;">
        <ion-skeleton-text animated/>
      </h2>
      <div style="display: flex; align-items: center; justify-content: space-between; font-size: 80%;">
        <ion-note>
          <ion-skeleton-text animated style="width: 100px;"/>
        </ion-note>
        <ion-note>
          <ion-skeleton-text animated style="width: 100px;"/>
        </ion-note>
      </div>
    </ion-label>
  </ion-item>
  <ion-item button
            color="primary"
            :detail="false"
            v-else>
    <ion-thumbnail slot="start">
      {{ invitation.attendance?.serial_number ?? '-' }}
    </ion-thumbnail>
    <ion-label class="ion-padding-vertical">
      <div style="display: flex;align-items: center;justify-content: space-between;">
        <h3>
          [{{ invitation.guest_code }}]
        </h3>
        <ion-note v-if="invitation.group">
          <h3>
            {{ invitation.group.group_name }}
          </h3>
        </ion-note>
      </div>
      <h2 class="ion-text-wrap ion-padding-vertical" style="margin: 0;">
        {{ invitation.name }}
      </h2>
      <div style="display: flex; align-items: center; justify-content: space-between; font-size: 80%;">
        <ion-note>
          <h3>
            Table:
            <strong>{{ invitation.seating?.name ?? '-' }}</strong>
          </h3>
        </ion-note>
        <ion-note>
          <h3>
            Guests:
            <strong><span v-if="invitation.is_family">Family</span> ({{ invitation.pax ?? invitation.guests }})</strong>
          </h3>
        </ion-note>
      </div>
    </ion-label>
  </ion-item>
</template>

<style scoped>
ion-thumbnail {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 25px;
  white-space: nowrap;
}

ion-skeleton-text {
  --background: var(--ion-color-light) !important
}

ion-item {
  --ion-color-shade: var(--ion-color-light) !important
}
</style>

<script>
import {defineComponent} from 'vue';
import {IonItem, IonLabel, IonNote, IonSkeletonText, IonThumbnail} from '@ionic/vue';

export default defineComponent({
  name: 'InvitationItem',
  props: {
    invitation: Object,
    skeleton: Boolean
  },
  components: {
    IonItem,
    IonThumbnail,
    IonLabel,
    IonNote,
    IonSkeletonText
  }
});
</script>
