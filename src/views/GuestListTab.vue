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
          <ion-item v-for="invitation in invitationRow.invitations" :key="invitation.id" button
                    @click="showInvitation(invitation)">
            <ion-thumbnail slot="start" class="ion-align-items-center ion-justify-content-center"
                           style="display: flex;">
              <span v-if="invitation.attendance">
                {{ invitation.attendance.serial_number }}
              </span>
              <span v-else>
                -
              </span>
            </ion-thumbnail>
            <ion-label class="ion-padding-vertical">
              <div style="display: flex;align-items: center;justify-content: space-between;">
                <h2>
                  [{{ invitation.guest_code }}]
                </h2>
                <ion-note v-if="invitation.group">
                  {{ invitation.group.group_name }}
                </ion-note>
              </div>
              <h1 class="ion-padding-vertical ion-text-wrap">
                {{ invitation.name }}
              </h1>
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <ion-note>
                  Table:
                  <strong>{{ invitation.seating?.name ?? '-' }}</strong><br>
                </ion-note>
                <ion-note>
                  Guests:
                  <strong>
                    <span v-if="invitation.is_family">
                      Family
                    </span>
                    ({{ invitation.pax ?? invitation.guests }})
                  </strong>
                </ion-note>
              </div>
            </ion-label>
          </ion-item>
        </ion-item-group>
      </ion-list>
    </ion-content>
    <ion-footer>
      <ion-toolbar class="ion-padding-vertical" style="padding-bottom: 16px;">
        <ion-button expand="block" color="primary" class="ion-padding-horizontal">
          SCAN
        </ion-button>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script>
import {computed, defineComponent, inject, ref} from 'vue';
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
  IonNote,
  IonPage,
  IonPopover,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonSkeletonText,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  useIonRouter
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
    IonFooter
  },
  setup() {
    const {state} = inject('store');
    const ionRouter = useIonRouter();

    const search = ref('');

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
      ionRouter.push({name: 'invitations.show', params: {guest_code: invitation.guest_code}});
    }

    return {
      icons: {
        qrCode: qrCodeSharp
      },
      invitations: filteredInvitations,
      search,
      doRefresh,
      showInvitation,
      state
    };
  }
});
</script>
