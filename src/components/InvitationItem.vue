<template>
  <ion-item button>
    <ion-thumbnail slot="start" class="ion-align-items-center ion-justify-content-center"
                   style="display: flex;">
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
            <strong>{{ invitation.seating?.name ?? '-' }}</strong><br>
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

<script>
import {defineComponent} from 'vue';
import {IonItem, IonLabel, IonNote, IonThumbnail} from '@ionic/vue';

export default defineComponent({
  name: 'InvitationItem',
  props: [
    'invitation'
  ],
  components: {
    IonItem,
    IonThumbnail,
    IonLabel,
    IonNote
  }
});
</script>
