<template>
  <ion-item-group v-for="invitationRow in invitations" :key="invitationRow.key">
    <ion-item-divider sticky color="light">
      <ion-label>
        {{ invitationRow.key }}
      </ion-label>
    </ion-item-divider>
    <DynamicScroller class="scroller ion-content-scroll-host"
                     :min-item-size="143"
                     :items="invitationRow.invitations"
                     key-field="guest_code"
    >
      <template v-slot="{ item, index, active }">
        <DynamicScrollerItem
            :item="item"
            :active="active"
            :size-dependencies="[item.name]"
            :data-index="index"
        >
          <InvitationItem @click="showInvitation(item)" :invitation="item"/>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </ion-item-group>
</template>

<script>
import {defineComponent} from 'vue';
import {IonItemDivider, IonItemGroup, IonLabel} from '@ionic/vue';
import InvitationItem from '@/components/InvitationItem';

export default defineComponent({
  components: {
    IonItemGroup,
    IonItemDivider,
    IonLabel,
    InvitationItem
  }
});
</script>
