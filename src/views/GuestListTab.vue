<template>
  <ion-page>
    <ion-header style="background-color: var(--ion-color-secondary)">
      <ion-toolbar color="secondary">
        <ion-title>
          List Undangan
          <small style="display: block;font-weight: normal;">
            Usher: {{ state.sequenceGroup }} - {{ state.usherList[state.sequenceGroup] }}
          </small>
        </ion-title>
        <ion-buttons slot="end">
          <ion-button color="light" router-link="/set-usher">
            <small>
              Ganti Usher
            </small>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar color="secondary">
        <ion-buttons slot="start">
          <ion-skeleton-text animated style="width: 100px;"
                             v-if="isLoadingGroups || state.invitations.isLoading"></ion-skeleton-text>
          <ion-select placeholder="Group" v-else style="max-width: 100px"
                      :interface-options="{ header: 'Filter By Group', cssClass: 'ion-color-secondary group-filter-alert' }"
                      :value="selectedGroup"
                      @ionChange="filterGroup.handleOnChange"
                      @ionCancel="filterGroup.handleOnCancel"
                      cancel-text="Semua">
            <ion-select-option v-for="group in groupResponse.groups"
                               :key="group.id"
                               :value="group.id">
              {{ group.group_name }}
            </ion-select-option>
          </ion-select>
        </ion-buttons>
        <form action="" @submit.prevent>
          <ion-searchbar animated
                         placeholder="nama / kode tamu / serial"
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
          @willDismiss="invitationModal.setOpen(false)">
        <div class="ion-page">
          <ion-header>
            <ion-toolbar color="secondary">
              <ion-title>
                {{ invitationModal.invitation.guest_code }}
              </ion-title>
              <ion-buttons slot="end">
                <ion-button @click="invitationModal.setOpen(false)">Close</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content color="primary">
            <div class="ion-padding">
              <h1 style="text-align: center; margin-top: 0 !important;">
                {{ invitationModal.invitation.name }}
              </h1>
              <div style="display: flex; align-items: center; justify-content: space-between;">
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
                <ion-buttons>
                  <ion-button fill="solid" class="ion-color" style="width: 70px;"
                              :disabled="(invitationModal.attendance.sequence_group && invitationModal.attendance.sequence_group !== state.sequenceGroup)"
                              @click="setNoAngpao()"
                              :class="{ 'ion-color-success': invitationModal.attendance.has_gift == false, 'ion-color-light': invitationModal.attendance.has_gift == true || invitationModal.attendance.has_gift == null }">
                    No
                  </ion-button>
                  <div style="width: 70px;"></div>
                  <ion-button fill="solid" class="ion-color" style="width: 70px;"
                              :disabled="(invitationModal.attendance.sequence_group && invitationModal.attendance.sequence_group !== state.sequenceGroup)"
                              @click="setYesAngpao()"
                              :class="{ 'ion-color-success': invitationModal.attendance.has_gift == true, 'ion-color-light': invitationModal.attendance.has_gift == false || invitationModal.attendance.has_gift == null }">
                    Yes
                  </ion-button>
                </ion-buttons>
              </div>
              <div class="ion-padding-vertical">
                <div style="display: flex;align-items: center;" class="ion-margin-bottom">
                  <ion-label color="light">
                    Titip Angpao
                  </ion-label>
                </div>
                <ion-list style="width: 100%; padding-top: 0;padding-bottom: 0;"
                          v-if="invitationModal.attendance.notes.length">
                  <ion-item lines="full" v-for="(note, index) in invitationModal.attendance.notes" :key="index">
                    <ion-label slot="start">
                      {{ index + 1 }}
                    </ion-label>
                    <ion-input placeholder="Nama Tamu"
                               autocapitalize="words"
                               enterkeyhint="done"
                               color="dark"
                               :disabled="(invitationModal.attendance.sequence_group && invitationModal.attendance.sequence_group !== state.sequenceGroup)"
                               @ionBlur="focusExtraGift = false; handleBlurExtraGift(index);"
                               @ionChange="focusExtraGift = true;"
                               @keyup.enter="doneEditing($event)"
                               v-model="invitationModal.attendance.notes[index]"/>
                    <ion-button slot="end" color="success" shape="round" style="width: 24px;height: 24px;"
                                :disabled="(invitationModal.attendance.sequence_group && invitationModal.attendance.sequence_group !== state.sequenceGroup)"
                                @click="handleBlurExtraGift(index)"
                                v-if="focusExtraGift">
                      <ion-icon :icon="icons.check" slot="icon-only"></ion-icon>
                    </ion-button>
                    <ion-button slot="end" color="danger"
                                :disabled="(invitationModal.attendance.sequence_group && invitationModal.attendance.sequence_group !== state.sequenceGroup)"
                                @click="handleDeleteExtraGift(index)"
                                v-else>
                      Hapus
                    </ion-button>
                  </ion-item>
                </ion-list>
                <ion-buttons class="ion-margin-top">
                  <ion-button size="small" style="width: 70px;" fill="solid"
                              :disabled="invitationModal.attendance.sequence_group !== state.sequenceGroup"
                              @click="invitationModal.attendance.notes.push('')"
                              v-if="!invitationModal.attendance.notes.includes('') && !focusExtraGift">
                    <ion-icon :icon="icons.add" slot="icon-only"></ion-icon>
                  </ion-button>
                </ion-buttons>
                <ion-label color="medium" style="margin-top: 16px !important;display: block;"
                           v-if="!invitationModal.attendance.serial_number">
                  CHECK IN dulu baru tambahin Titipan Angpao
                </ion-label>
              </div>
            </div>
          </ion-content>
          <ion-footer>
            <ion-toolbar color="secondary"
                         class="ion-padding-vertical"
                         style="padding-top: 20px !important;padding-bottom: 20px !important;height: 110px;"
                         v-if="invitationModal.attendance.serial_number">
              <ion-buttons slot="start">
                <div style="width: 70px;"></div>
                <!--                <ion-button color="primary" fill="solid" style="width: 70px;"-->
                <!--                            @click="performCheckIn()"-->
                <!--                            v-if="invitationModal.attendance.serial_number"-->
                <!--                            :disabled="invitationModal.attendance.has_gift == null || (invitationModal.attendance.sequence_group && invitationModal.attendance.sequence_group !== state.sequenceGroup)">-->
                <!--                  Update-->
                <!--                </ion-button>-->
              </ion-buttons>
              <ion-title size="large" style="text-align: center;"
                         v-if="invitationModal.attendance.serial_number">
                {{ invitationModal.attendance.serial_number }}
                <ion-text color="medium">
                  <small style="display: block; font-size: 16px">
                    ({{ invitationModal.attendance.checkin_time }})
                  </small>
                </ion-text>
              </ion-title>
              <ion-buttons slot="end">
                <ion-button color="danger" fill="solid" style="width: 70px;"
                            @click="confirmDelete(invitationModal.attendance.id)"
                            v-if="invitationModal.attendance.serial_number"
                            :disabled="invitationModal.attendance.sequence_group !== state.sequenceGroup">
                  Hapus
                </ion-button>
              </ion-buttons>
            </ion-toolbar>
            <ion-toolbar color="secondary"
                         class=""
                         style="padding-top: 26px !important;padding-bottom: 26px !important; height: 110px;"
                         v-else>
              <ion-button expand="block" :color="checkInButton[confirmCheckIn].color"
                          shape="round"
                          class="btn-progress"
                          :class="{ 'btn-progress--start': confirmCheckIn === 1 }"
                          ref="btnProgress" mode="ios"
                          :disabled="invitationModal.attendance.has_gift == null || (invitationModal.attendance.sequence_group && invitationModal.attendance.sequence_group !== state.sequenceGroup)"
                          @click="handleCheckIn">
                {{
                  invitationModal.attendance?.serial_number ? checkInButton[confirmCheckIn].text_update :
                      checkInButton[confirmCheckIn].text
                }}
              </ion-button>
            </ion-toolbar>
          </ion-footer>
        </div>
      </ion-modal>
      <ion-loading
          :is-open="invitationModal.isLoading"/>
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
         class="scanner__container" style="background-color: var(--ion-color-primary);">
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

.group-filter-alert {
  --max-width: calc(100% - 32px);
  --width: 100%;
}
</style>

<script>
import {computed, defineComponent, inject, onMounted, reactive, ref} from 'vue';
import {add, close, createOutline, qrCodeSharp, checkmark} from 'ionicons/icons';
import {
  alertController,
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
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
  IonText,
  IonTitle,
  IonToolbar,
  onIonViewWillEnter,
  toastController,
  useIonRouter
} from '@ionic/vue';
import {useMutation, useQuery} from '@urql/vue';
import {ALL_GROUPS_QUERY, ALL_INVITATIONS_QUERY} from '@/graphql/queries';
import InvitationItem from '@/components/InvitationItem';
import {CHECKIN_MUTATION, DELETE_ATTENDANCE_MUTATION} from '@/graphql/mutations';
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
    InvitationItem,
    IonFab,
    IonFabButton,
    RecycleScroller,
    IonSelect,
    IonSelectOption,
    IonItem,
    IonLabel,
    IonInput,
    IonLoading
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

    const {executeMutation: checkIn} = useMutation(CHECKIN_MUTATION);

    const invitationModal = reactive({
      isOpen: false,
      isLoading: false,

      invitation: null,
      attendance: {
        has_gift: null,
        notes: []
      },

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

    async function setNoAngpao() {
      invitationModal.attendance.has_gift = false;

      if (invitationModal.attendance.serial_number) {
        performCheckIn();
      }
    }

    async function setYesAngpao() {
      invitationModal.attendance.has_gift = true;

      if (invitationModal.attendance.serial_number) {
        performCheckIn();
      }
    }

    async function handleCheckIn() {
      confirmCheckIn.value++;

      if (confirmCheckIn.value < 2) {
        confirmTimer = setTimeout(() => {
          confirmCheckIn.value = 0;
        }, 3000);
      } else {
        clearTimeout(confirmTimer);
        confirmCheckIn.value = 0;

        await performCheckIn();
      }
    }

    async function performCheckIn() {
      const toast = await toastController.create({
        message: 'Success!',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });

      invitationModal.isLoading = true;
      const payload = {
        guest_code: invitationModal.invitation.guest_code,
        has_gift: invitationModal.attendance.has_gift,
        sequence_group: state.sequenceGroup,
        notes: invitationModal.attendance.notes
      };
      const {data: checkinResponse} = await checkIn(payload);
      reloadInvitations();
      invitationModal.isLoading = false;

      await toast.present();

      invitationModal.attendance = checkinResponse.checkIn.attendance;
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
            invitation.guest_code.toLowerCase().includes(search.value.toLowerCase()) ||
            invitation.attendance?.serial_number.toLowerCase().includes(search.value.toLowerCase());
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
      invitationModal.attendance = {
        has_gift: null,
        notes: []
      };
      if (invitation.attendance?.serial_number) {
        invitationModal.attendance = invitation.attendance;
      }
      if (!invitation.attendance?.notes) {
        invitationModal.attendance.notes = [];
      }
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

      async onScanSuccess(decodedText) {
        let query = decodedText;
        scanner.stopScan();

        let filteredInvitation = state.invitations.find(invitation => {
          return invitation.guest_code == query;
        });

        if (filteredInvitation) {
          return showInvitation(filteredInvitation);
        }

        const toast = await toastController.create({
          message: 'Invitation [' + query + '] not found!',
          duration: 2000,
          position: 'bottom',
          color: 'danger'
        });

        await toast.present();
      }
    });

    const router = useIonRouter();
    onIonViewWillEnter(() => {
      if (!state.sequenceGroup) {
        router.replace('set-usher');
      }
    });

    onMounted(() => {
      qrScanner = new QrScanner(
          document.getElementById('scannerView'),
          result => scanner.onScanSuccess(result.data),
          {
            highlightScanRegion: true
          }
      );
    });

    const {executeMutation: deleteAttendanceMutation} = useMutation(DELETE_ATTENDANCE_MUTATION);

    async function confirmDelete(id) {
      const alert = await alertController.create({
        header: 'Delete attendance?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'OK',
            role: 'confirm',
            handler: () => {
              handleDeleteAttendance(id);
            }
          }
        ]
      });

      await alert.present();
    }

    async function handleDeleteAttendance(id) {
      invitationModal.isLoading = true;
      await deleteAttendanceMutation({
        id: id
      });
      invitationModal.attendance = {
        has_gift: null,
        notes: []
      };
      reloadInvitations();
      invitationModal.isLoading = false;
    }

    const focusExtraGift = ref(false);

    async function handleBlurExtraGift(index) {
      if (invitationModal.attendance.notes[index] === '') {
        return handleDeleteExtraGift(index);
      }

      return performCheckIn();
    }

    async function handleDeleteExtraGift(index) {
      const alert = await alertController.create({
        header: 'Hapus titipan ' + (index + 1) + ' ' + invitationModal.attendance.notes[index] + '?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'OK',
            role: 'confirm',
            handler: () => {
              invitationModal.attendance.notes.splice(index, 1);
              if (invitationModal.attendance.serial_number) {
                performCheckIn();
              }
            }
          }
        ]
      });

      await alert.present();
    }

    return {
      icons: {
        qrCode: qrCodeSharp,
        edit: createOutline,
        close: close,
        add: add,
        check: checkmark
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
      performCheckIn,
      setNoAngpao,
      setYesAngpao,

      scanner,

      isLoadingGroups: groupResponse.fetching,
      groupResponse: groupResponse.data,
      filterGroup,
      selectedGroup,

      confirmDelete,

      handleDeleteExtraGift,
      handleBlurExtraGift,
      focusExtraGift,
      doneEditing(event) {
        event.target.blur();
      }
    };
  }
});
</script>
