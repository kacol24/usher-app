<template>
  <ion-page>
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
      <ion-toolbar>
        <ion-segment value="all">
          <ion-segment-button value="all">
            <ion-label class="ion-padding-horizontal">All</ion-label>
          </ion-segment-button>
          <ion-segment-button value="checked_in">
            <ion-label class="ion-padding-horizontal">Checked-in</ion-label>
          </ion-segment-button>
          <ion-segment-button value="not_checked">
            <ion-label class="ion-padding-horizontal">Not Checked-in</ion-label>
          </ion-segment-button>
        </ion-segment>
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
                <ion-item button @click="showInvitation(item)">
                  <ion-thumbnail slot="start" class="ion-align-items-center ion-justify-content-center"
                                 style="display: flex;">
                    <span v-if="item.attendance">
                      {{ item.attendance.serial_number }}
                    </span>
                    <span v-else>
                      -
                    </span>
                  </ion-thumbnail>
                  <ion-label class="ion-padding-vertical">
                    <div style="display: flex;align-items: center;justify-content: space-between;">
                      <h3>
                        [{{ item.guest_code }}]
                      </h3>
                      <ion-note v-if="item.group">
                        <h3>
                          {{ item.group.group_name }}
                        </h3>
                      </ion-note>
                    </div>
                    <h2 class="ion-text-wrap ion-padding-vertical" style="margin: 0;">
                      {{ item.name }}
                    </h2>
                    <div style="display: flex; align-items: center; justify-content: space-between; font-size: 80%;">
                      <ion-note>
                        <h3>
                          Table:
                          <strong>{{ item.seating?.name ?? '-' }}</strong><br>
                        </h3>
                      </ion-note>
                      <ion-note>
                        <h3>
                          Guests:
                          <strong>
                            <span v-if="item.is_family">
                              Family
                            </span>
                            ({{ item.pax ?? item.guests }})
                          </strong>
                        </h3>
                      </ion-note>
                    </div>
                  </ion-label>
                </ion-item>
              </DynamicScrollerItem>
            </template>
          </DynamicScroller>
        </ion-item-group>
      </ion-list>

      <ion-modal :is-open="invitationModal.isOpen">
        <ion-page>
          <ion-header>
            <ion-toolbar>
              <ion-title>
                {{ invitationModal.invitation.name }}
              </ion-title>
              <ion-buttons slot="end">
                <ion-button @click="invitationModal.setOpen(false)">Close</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding" :fullscreen="true" :scroll-y="false">
            <h1 class="ion-text-center ion-padding-vertical ion-margin-vertical">
              {{ invitationModal.invitation.name }}
              <small style="display: block;" class="ion-margin-top">
                [{{ invitationModal.invitation.guest_code }}]
              </small>
            </h1>
            <div style="display: flex; align-items: center; justify-content: space-between;"
                 class="ion-padding-top ion-margin-top">
              <div>
                Table<br>
                <h3>
                  {{ invitationModal.invitation.seating.name ?? '-' }}
                </h3>
              </div>
              <div>
                Guests<br>
                <h3>
                  <span v-if="invitationModal.invitation.is_family">Family</span>
                  ({{ invitationModal.invitation.pax ?? invitationModal.invitation.guests }})
                </h3>
              </div>
            </div>
            <ion-loading
                :is-open="state.isLoading"/>
          </ion-content>
          <ion-footer>
            <ion-toolbar style="min-height: 120px;">
              <div class="ion-text-center">
                <h2 style="font-size: 52px;" class="ion-margin-vertical">
                  <template v-if="invitationModal.invitation.attendance">
                    {{ invitationModal.invitation.attendance.serial_number ?? '-' }}
                    <ion-text color="medium">
                      <small style="display: block; font-size: 16px">
                        (18:12:34)
                      </small>
                    </ion-text>
                  </template>
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
      </ion-modal>
    </ion-content>
    <ion-footer>
      <ion-toolbar class="ion-padding-vertical" style="padding-bottom: 16px;">
        <ion-button expand="block" color="primary" class="ion-padding-horizontal" size="large" mode="ios">
          SCAN
        </ion-button>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<style>
.scroller {
  height: 100%;
}
</style>

<script>
import {computed, defineComponent, inject, reactive, ref} from 'vue';
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
  IonSegment,
  IonSegmentButton,
  IonSkeletonText,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import {useQuery} from '@urql/vue';
import {GROUPED_INVITATIONS_QUERY} from '@/graphql/queries';

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
    IonSegment,
    IonSegmentButton,
    IonFooter,
    IonModal,
    IonLoading,
    IonText
  },
  setup() {
    const {state} = inject('store');

    const search = ref('');
    const invitationModal = reactive({
      isOpen: false,
      invitation: null,

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
        state.isLoading = true;
        confirmCheckIn.value = 0;
        btnProgress.value.$el.classList.remove('btn-progress', 'btn-progress--start');
        setTimeout(() => state.isLoading = false, 1000);
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

      await executeQuery({
        requestPolicy: 'network-only'
      });
      state.invitations = [];
      response.value.groupedInvitations.forEach(invitation => {
        state.invitations.push(invitation);
      });

      state.isLoading = false;
    }

    function showInvitation(invitation) {
      invitationModal.invitation = invitation;
      invitationModal.setOpen(true);
    }

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
      handleCheckIn
    };
  }
});
</script>
