<template>
  <ion-page ref="pageRef">
    <ion-header style="background-color: var(--ion-color-secondary)">
      <ion-toolbar color="secondary">
        <ion-title>
          Guest List
          <small style="display: block;font-weight: normal;">
            Usher - {{ state.sequenceGroup }}
          </small>
        </ion-title>
        <ion-buttons slot="end">
          <ion-button color="light" router-link="/set-usher">
            <small>
              Change Usher
            </small>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar color="secondary">
        <ion-buttons slot="start">
          <ion-skeleton-text animated style="width: 100px;"
                             v-if="isLoadingGroups || state.invitations.isLoading"></ion-skeleton-text>
          <ion-select placeholder="Groups" v-else style="max-width: 100px"
                      :interface-options="{ header: 'Filter By Group', cssClass: 'ion-color-secondary' }"
                      :value="selectedGroup"
                      @ionChange="filterGroup.handleOnChange"
                      @ionCancel="filterGroup.handleOnCancel"
                      cancel-text="Show All">
            <ion-select-option v-for="group in groupResponse.groups"
                               :key="group.id"
                               :value="group.id">
              {{ group.group_name }}
            </ion-select-option>
          </ion-select>
        </ion-buttons>
        <form action="" @submit.prevent>
          <ion-searchbar animated
                         placeholder="Search guest code / name"
                         color="dark"
                         inputmode="search"
                         show-cancel-button="focus"
                         show-clear-button="focus"
                         type="search"
                         :disabled="state.isLoading"
                         v-model="search"/>
        </form>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true"
                 :scroll-y="false">
      <ion-list v-if="state.isLoading" style="height: 100%;--ion-item-background: var(--ion-color-primary)">
        <InvitationItem v-for="invitation in Array(10)" :key="invitation" skeleton/>
      </ion-list>

      <ion-list style="height: 100%;--ion-item-background: var(--ion-color-primary)"
                v-else>
        <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
          <ion-refresher-content/>
        </ion-refresher>
        <RecycleScroller class="ion-content-scroll-host scroller"
                         :items="invitations"
                         :item-size="150"
                         key-field="guest_code">
          <template v-slot="{ item }">
            <InvitationItem @click="showInvitation(item)" :invitation="item"/>
          </template>
        </RecycleScroller>
      </ion-list>

      <ion-modal
          :is-open="invitationModal.isOpen"
          :can-dismiss="true"
          :presenting-element="invitationModal.presentingElement"
          @willDismiss="invitationModal.setOpen(false)">
        <div class="ion-page">
          <ion-header>
            <ion-toolbar color="secondary">
              <ion-title>
                Invitation Detail
              </ion-title>
              <ion-buttons slot="end">
                <ion-button @click="invitationModal.setOpen(false)">Close</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content color="primary">
            <div class="ion-padding">
              <h1 style="text-align: center;">
                {{ invitationModal.invitation.name }}
                <small style="display: block;" class="ion-margin-top">
                  {{ invitationModal.invitation.guest_code }}
                </small>
              </h1>
              <div style="display: flex; align-items: center; justify-content: space-between;"
                   class="ion-margin-vertical">
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
                  Angpao
                </div>
                <ion-toggle
                    color="danger"
                    :checked="invitationModal.hasGift"
                    @ionChange="invitationModal.hasGift = ! invitationModal.hasGift"/>
              </div>
              <div class="ion-padding-vertical">
                <ion-item color="light">
                  <ion-label position="stacked">
                    Notes
                  </ion-label>
                  <ion-textarea placeholder="Enter more information here..." rows="3" auto-grow
                                color="dark" enterkeyhint="done" inputmode="text" wrap="soft"
                                v-model="invitationModal.notes"></ion-textarea>
                </ion-item>
              </div>
            </div>
          </ion-content>
          <ion-footer>
            <ion-toolbar color="secondary" class="ion-padding-vertical" style="padding-top: 16px;padding-bottom: 16px;">
              <ion-title size="large" style="text-align: center;"
                         v-if="invitationModal.serialNumber">
                {{ invitationModal.serialNumber }}
                <ion-text color="medium">
                  <small style="display: block; font-size: 16px">
                    ({{ invitationModal.checkinTime }})
                  </small>
                </ion-text>
              </ion-title>
              <ion-buttons slot="end">
                <ion-button color="danger"
                            v-if="invitationModal.serialNumber">
                  <ion-icon :icon="icons.close" slot="icon-only"></ion-icon>
                </ion-button>
              </ion-buttons>
            </ion-toolbar>
            <ion-toolbar color="secondary" class="ion-padding-bottom" style="margin-top: -1px; padding-bottom: 16px;">
              <ion-button expand="block" :color="checkInButton[confirmCheckIn].color"
                          shape="round"
                          class="ion-padding-horizontal btn-progress ion-margin-bottom"
                          :class="{ 'btn-progress--start': confirmCheckIn === 1 }"
                          ref="btnProgress" mode="ios"
                          @click="handleCheckIn">
                {{
                  invitationModal.serialNumber ? checkInButton[confirmCheckIn].text_update :
                      checkInButton[confirmCheckIn].text
                }}
              </ion-button>
            </ion-toolbar>
          </ion-footer>
        </div>
      </ion-modal>
      <ion-loading
          :is-open="invitationModal.isLoading"/>
      <ion-toast
          :is-open="toast.isOpen"
          duration="2000"
          message="Check-in success!"
          color="success"
          @didDismiss="toast.setOpen(false)"/>
      <ion-toast
          :is-open="errorToast.isOpen"
          duration="2000"
          :message="errorToast.message"
          color="danger"
          @didDismiss="errorToast.setOpen(false)"/>
      <ion-fab
          vertical="bottom"
          horizontal="center"
          slot="fixed">
        <ion-fab-button
            color="secondary"
            :disabled="state.isLoading"
            :activated="scanner.isStarted"
            @click="scanner.startScan()">
          <ion-icon :icon="icons.qrCode"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
    <div v-show="scanner.isStarted"
         class="scanner__container">
      <video id="scannerView" class="scanner__view"></video>
    </div>
  </ion-page>
</template>

<style lang="scss">
.scanner__container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 998;
  background-color: #fff;
  line-height: 0;

  .scan-region-highlight-svg {
    stroke: var(--ion-color-secondary-tint) !important;
  }
}

.scanner__view {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

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

.searchbar-cancel-button {
  --ion-color-base: var(--ion-color-light) !important;
}

.ion-color .searchbar-input {
  background: var(--ion-color-secondary-tint) !important
}
</style>

<script>
import {computed, defineComponent, inject, onMounted, reactive, ref} from 'vue';
import {createOutline, qrCodeSharp, closeCircle} from 'ionicons/icons';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonFooter,
  IonHeader,
  IonIcon, IonItem, IonLabel,
  IonList,
  IonLoading,
  IonModal,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonSkeletonText,
  IonText, IonTextarea,
  IonTitle,
  IonToast,
  IonToggle,
  IonToolbar,
  onIonViewWillEnter,
  useIonRouter
} from '@ionic/vue';
import {useMutation, useQuery} from '@urql/vue';
import {ALL_GROUPS_QUERY, ALL_INVITATIONS_QUERY} from '@/graphql/queries';
import InvitationItem from '@/components/InvitationItem';
import {CHECKIN_MUTATION} from '@/graphql/mutations';
import QrScanner from 'qr-scanner';
import {RecycleScroller} from 'vue-virtual-scroller';

export default defineComponent({
  name: 'GuestListTab',
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonList,
    IonRefresher,
    IonRefresherContent,
    IonSkeletonText,
    IonSearchbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonFooter,
    IonModal,
    IonText,
    IonLoading,
    InvitationItem,
    IonToggle,
    IonToast,
    IonFab,
    IonFabButton,
    RecycleScroller,
    IonSelect,
    IonSelectOption,
    IonItem,
    IonLabel,
    IonTextarea
  },
  setup() {
    const {state} = inject('store');

    const search = ref('');

    const groupResponse = useQuery({
      query: ALL_GROUPS_QUERY
    });
    const selectedGroup = ref('');
    const filterGroup = reactive({
      handleOnChange(e) {
        selectedGroup.value = e.detail.value;
      },
      handleOnCancel() {
        selectedGroup.value = '';
      }
    });

    const toast = reactive({
      isOpen: false,

      setOpen(open) {
        this.isOpen = open;
      }
    });

    const errorToast = reactive({
      isOpen: false,
      message: 'Whoops! Something went wrong',

      setOpen(open) {
        this.isOpen = open;
      }
    });

    const {executeMutation: checkIn} = useMutation(CHECKIN_MUTATION);

    const pageRef = ref();
    const invitationModal = reactive({
      presentingElement: null,

      isOpen: false,
      isLoading: false,

      invitation: null,
      serialNumber: null,
      checkinTime: null,
      hasGift: true,
      notes: null,

      setOpen(open) {
        this.isOpen = open;
      }
    });

    const confirmCheckIn = ref(0);
    const btnProgress = ref();
    const checkInButton = ref([
      {
        color: 'primary',
        text: 'CHECK IN',
        text_update: 'UPDATE CHECK IN'
      },
      {
        color: 'success',
        text: 'CONFIRM CHECK IN',
        text_update: 'CONFIRM CHECK IN'
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
        const payload = {
          guest_code: invitationModal.invitation.guest_code,
          has_gift: invitationModal.hasGift,
          sequence_group: state.sequenceGroup,
          notes: invitationModal.notes
        };
        const {data: checkinResponse} = await checkIn(payload);
        invitationModal.isLoading = false;

        invitationModal.serialNumber = checkinResponse.checkIn.attendance.serial_number;
        invitationModal.checkinTime = checkinResponse.checkIn.attendance.checkin_time;
        invitationModal.notes = checkinResponse.checkIn.attendance.notes;
        toast.isOpen = true;

        pushInvitations(checkinResponse.checkIn.invitations);
      }
    }

    const filteredInvitations = computed(() => {
      if (!search.value && !selectedGroup.value) {
        return state.invitations;
      }

      let invitations = state.invitations;
      if (selectedGroup.value) {
        invitations = state.invitations.filter(invitation => {
          return invitation.group?.id == selectedGroup.value;
        });
      }

      return invitations.filter(invitation => {
        return invitation.name.toLowerCase().includes(search.value.toLowerCase()) ||
            invitation.guest_code.toLowerCase().includes(search.value.toLowerCase());
      });
    });

    const {executeQuery, data: response} = useQuery({
      query: ALL_INVITATIONS_QUERY
    });

    async function doRefresh(e) {
      state.isLoading = true;
      e.detail.complete();
      await reloadInvitations();
      state.isLoading = false;
    }

    async function reloadInvitations() {
      await executeQuery({
        requestPolicy: 'network-only'
      });
      pushInvitations(response.value.invitations);
    }

    function pushInvitations(invitations) {
      state.invitations = invitations;
    }

    function showInvitation(invitation) {
      invitationModal.invitation = invitation;
      invitationModal.hasGift = invitation.attendance?.has_gift ?? true;
      invitationModal.serialNumber = invitation.attendance?.serial_number;
      invitationModal.checkinTime = invitation.attendance?.checkin_time;
      invitationModal.notes = invitation.attendance?.notes;
      invitationModal.setOpen(true);
    }

    let qrScanner;
    const scanner = reactive({
      isStarted: false,

      startScan() {
        if (this.isStarted) {
          return this.stopScan();
        }

        this.isStarted = true;
        qrScanner.start();
      },
      stopScan() {
        this.isStarted = false;
        qrScanner.stop();
      },

      onScanSuccess(decodedText) {
        let query = decodedText;
        scanner.stopScan();

        let filteredInvitation = state.invitations.find(invitation => {
          return invitation.guest_code == query;
        });

        if (filteredInvitation) {
          return showInvitation(filteredInvitation);
        }

        errorToast.message = 'Invitation [' + query + '] not found!';
        errorToast.isOpen = true;
      }
    });

    const router = useIonRouter();
    onIonViewWillEnter(() => {
      if (!state.sequenceGroup) {
        router.replace('set-usher');
      }
    });

    onMounted(() => {
      invitationModal.presentingElement = pageRef.value.$el;
      qrScanner = new QrScanner(
          document.getElementById('scannerView'),
          result => scanner.onScanSuccess(result.data),
          {
            highlightScanRegion: true
          }
      );
    });

    return {
      icons: {
        qrCode: qrCodeSharp,
        edit: createOutline,
        close: closeCircle
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
      pageRef,

      toast,
      errorToast,
      scanner,

      isLoadingGroups: groupResponse.fetching,
      groupResponse: groupResponse.data,
      filterGroup,
      selectedGroup
    };
  }
});
</script>
