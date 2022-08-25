<template>
  <ion-page ref="pageRef">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button id="filter-group">
            Groups
          </ion-button>
          <ion-popover trigger="filter-group" trigger-action="click">
            <ion-content class="ion-padding" :scroll-y="false">Hello World!</ion-content>
          </ion-popover>
        </ion-buttons>
        <ion-title>Guest List</ion-title>
        <ion-buttons slot="end">
          <ion-button>
            <ion-icon slot="icon-only" :icon="icons.qrCode"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <form>
          <ion-searchbar animated
                         inputmode="search"
                         show-cancel-button="focus"
                         show-clear-button="focus"
                         type="search"
                         v-model="search"/>
        </form>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
        <ion-refresher-content/>
      </ion-refresher>

      <ion-list v-if="state.isLoading">
        <ion-item-divider sticky>
          <ion-label style="width: 10%;">
            <ion-skeleton-text animated style="width: 100%;"/>
          </ion-label>
        </ion-item-divider>
        <ion-item v-for="invitation in Array(10)" :key="invitation">
          <ion-thumbnail slot="start">
            <ion-skeleton-text animated/>
          </ion-thumbnail>
          <ion-label class="ion-text-wrap">
            <h2>
              <ion-skeleton-text animated style="width: 35%;"/>
            </h2>
            <h3>
              <ion-skeleton-text animated style="width: 25%;"/>
            </h3>
          </ion-label>
          <ion-note slot="end" style="display: flex;flex-direction: column;align-items: flex-end;"
                    class="ion-padding-vertical">
            <ion-skeleton-text animated style="width: 50px;"/>
            <ion-skeleton-text animated style="width: 100px;"/>
            <br>
            <ion-skeleton-text animated style="width: 70px;"/>
            <ion-skeleton-text animated style="width: 50px;"/>
          </ion-note>
        </ion-item>
      </ion-list>

      <ion-list v-else>
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
      </ion-list>

      <ion-modal
          :is-open="invitationModal.isOpen"
          :can-dismiss="true"
          :presenting-element="invitationModal.presentingElement"
          @willDismiss="invitationModal.setOpen(false)">
        <div class="ion-page">
          <ion-header>
            <ion-toolbar>
              <ion-title>
                Invitation Detail
              </ion-title>
              <ion-buttons slot="end">
                <ion-button @click="invitationModal.setOpen(false)">Close</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content :scroll-y="false">
            <div class="ion-padding">
              <h1 class="ion-text-center ion-padding-vertical ion-margin-vertical">
                {{ invitationModal.invitation.name }}
                <small style="display: block;" class="ion-margin-top">
                  {{ invitationModal.invitation.guest_code }}
                </small>
              </h1>
              <div style="display: flex; align-items: center; justify-content: space-between;"
                   class="ion-padding-vertical ion-margin-vertical">
                <div>
                  Table<br>
                  <h3>
                    {{ invitationModal.invitation.seating?.name ?? '-' }}
                  </h3>
                </div>
                <div>
                  Guests<br>
                  <h3>
                    <span v-if="invitationModal.invitation.is_family">
                      Family
                    </span>
                    ({{ invitationModal.invitation.pax ?? invitationModal.invitation.guests }})
                  </h3>
                </div>
              </div>
              <div style="display: flex;justify-content: center;align-items: center;flex-direction: column;">
                <div class="ion-margin-bottom">
                  Gift
                </div>
                <ion-toggle
                    :checked="invitationModal.hasGift"
                    @ionChange="invitationModal.hasGift = ! invitationModal.hasGift"/>
              </div>
            </div>
          </ion-content>
          <ion-footer>
            <ion-toolbar style="min-height: 110px;">
              <div class="ion-text-center"
                   v-if="invitationModal.invitation.attendance">
                <h1 class="ion-margin-vertical" style="font-size: 39px">
                  {{ invitationModal.invitation.attendance?.serial_number }}
                  <ion-text color="medium">
                    <small style="display: block; font-size: 16px">
                      ({{ invitationModal.invitation.attendance?.checkin_time }})
                    </small>
                  </ion-text>
                </h1>
              </div>
            </ion-toolbar>
            <ion-toolbar>
              <ion-button expand="block" :color="checkInButton[confirmCheckIn].color"
                          class="ion-padding-horizontal btn-progress"
                          :class="{ 'btn-progress--start': confirmCheckIn === 1 }"
                          ref="btnProgress" mode="ios"
                          @click="handleCheckIn">
                {{ checkInButton[confirmCheckIn].text }}
              </ion-button>
            </ion-toolbar>
          </ion-footer>
        </div>
      </ion-modal>
      <ion-loading :is-open="invitationModal.isLoading"/>
    </ion-content>
  </ion-page>
</template>

<style>
.scroller {
  height: 100%;
}

.btn-progress::part(native):before {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: scaleX(1);
  transform-origin: center left;
}

.btn-progress--start::part(native):before {
  background-color: var(--ion-color-success-shade);
  transition: transform 3s linear;
  transform: scaleX(0);
}
</style>

<script>
import {computed, defineComponent, inject, onMounted, reactive, ref} from 'vue';
import {qrCodeSharp} from 'ionicons/icons';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonLoading,
  IonModal,
  IonNote,
  IonPage,
  IonPopover,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonSkeletonText,
  IonText,
  IonThumbnail,
  IonTitle, IonToggle,
  IonToolbar
} from '@ionic/vue';
import {useQuery} from '@urql/vue';
import {GROUPED_INVITATIONS_QUERY} from '@/graphql/queries';
import InvitationItem from '@/components/InvitationItem';

export default defineComponent({
  name: 'GuestListTab',
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonList,
    IonItem,
    IonLabel,
    IonRefresher,
    IonRefresherContent,
    IonSkeletonText,
    IonSearchbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonPopover,
    IonItemGroup,
    IonItemDivider,
    IonThumbnail,
    IonNote,
    IonFooter,
    IonModal,
    IonText,
    IonLoading,
    InvitationItem,
    IonToggle
  },
  setup() {
    const {state} = inject('store');

    const search = ref('');

    const pageRef = ref();
    const invitationModal = reactive({
      isOpen: false,
      isLoading: false,
      hasGift: true,

      invitation: null,
      presentingElement: null,

      setOpen(open) {
        this.isOpen = open;
      }
    });

    const confirmCheckIn = ref(0);
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

    let confirmTimer;

    async function handleCheckIn() {
      confirmCheckIn.value++;

      if (confirmCheckIn.value < 2) {
        confirmTimer = setTimeout(() => {
          confirmCheckIn.value = 0;
        }, 3000);
      } else {
        clearTimeout(confirmTimer);
        confirmCheckIn.value = 0;
        invitationModal.isLoading = true;

        await fetchInvitations();

        invitationModal.isLoading = false;
        invitationModal.invitation.attendance = {
          serial_number: 'A001',
          checkin_time: '12:34:56'
        };
      }
    }

    const filteredInvitations = computed(() => {
      if (!search.value) {
        return state.invitations;
      }

      let filtered = state.invitations.map(invitationGroup => {
        let invitations = invitationGroup.invitations.filter(invitation => {
          return invitation.name.toLowerCase().includes(search.value.toLowerCase()) ||
              invitation.guest_code.toLowerCase().includes(search.value.toLowerCase());
        });

        return {
          key: invitationGroup.key,
          invitations: invitations
        };
      });

      return filtered.filter(invitationGroup => invitationGroup.invitations.length);
    });

    const {executeQuery, data: response} = useQuery({
      query: GROUPED_INVITATIONS_QUERY
    });

    async function doRefresh(e) {
      state.isLoading = true;
      e.detail.complete();

      await fetchInvitations();

      state.isLoading = false;
    }

    async function fetchInvitations() {
      await executeQuery({
        requestPolicy: 'network-only'
      });
      pushInvitations(response.value.groupedInvitations);
    }

    function pushInvitations(invitations) {
      state.invitations = [];
      invitations.forEach(invitation => {
        state.invitations.push(invitation);
      });
    }

    function checkIn(guestCode, hasGift) {
      console.log(guestCode);
    }

    function showInvitation(invitation) {
      invitationModal.invitation = invitation;
      invitationModal.hasGift = invitation.attendance?.has_gift ?? true;
      invitationModal.setOpen(true);
    }

    onMounted(() => {
      invitationModal.presentingElement = pageRef.value.$el;
    });

    return {
      icons: {
        qrCode: qrCodeSharp
      },
      invitations: filteredInvitations,
      search,
      doRefresh,
      showInvitation,
      state,

      invitationModal,
      checkInButton,
      confirmCheckIn,
      btnProgress,
      handleCheckIn,
      pageRef
    };
  }
});
</script>
