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

      <ion-list v-if="isLoading">
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
          <ion-item v-for="invitation in invitationRow.invitations" :key="invitation.id">
            <ion-thumbnail slot="start" style="display: flex;"
                           class="ion-align-items-center ion-justify-content-center">
              <span v-if="invitation.attendance">
                {{ invitation.attendance.serial_number }}
              </span>
              <span v-else>
                -
              </span>
            </ion-thumbnail>
            <ion-label class="ion-text-wrap">
              [{{ invitation.guest_code }}]
              <h2>
                {{ invitation.full_name }}
              </h2>
              <ion-note v-if="invitation.group">
                {{ invitation.group.name }}
              </ion-note>
            </ion-label>
            <ion-note slot="end" class="ion-text-right ion-padding-vertical">
              Table<br>
              <strong>{{ invitation.seating?.name ?? '-' }}</strong><br>
              <br>
              Guest(s)<br>
              <strong>{{ invitation.pax ?? invitation.guests }}</strong>
            </ion-note>
          </ion-item>
        </ion-item-group>
      </ion-list>
    </ion-content>
    <ion-footer>
      <ion-toolbar>
        <ion-button expand="block" color="primary" class="ion-padding-horizontal">
          Scan
        </ion-button>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script>
import {computed, defineComponent, reactive, ref} from 'vue';
import {qrCodeSharp} from 'ionicons/icons';
import {
  IonButton,
  IonButtons,
  IonContent, IonFooter,
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
  IonSearchbar, IonSegment, IonSegmentButton,
  IonSkeletonText,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  onIonViewWillEnter
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
    const search = ref('');
    const invitations = reactive([]);
    const rawInvitations = reactive([]);

    const {fetching, executeQuery, data: response} = useQuery({
      query: GROUPED_INVITATIONS_QUERY,
      pause: true
    });

    const filteredInvitations = computed(() => {
      if (!search.value) {
        return invitations;
      }

      let filtered = rawInvitations.map(invitationGroup => {
        let invitations = invitationGroup.invitations.filter(invitation => {
          return invitation.name.toLowerCase().includes(search.value.toLowerCase());
        });

        return {
          key: invitationGroup.key,
          invitations: invitations
        };
      });

      return filtered.filter(invitationGroup => invitationGroup.invitations.length);
    });

    onIonViewWillEnter(async () => {
      await executeQuery();
      response.value.groupedInvitations.forEach(invitation => {
        rawInvitations.push(invitation);
        invitations.push(invitation);
      });
    });

    function doRefresh(e) {
      executeQuery({
        requestPolicy: 'network-only'
      });
      e.detail.complete();
    }

    return {
      icons: {
        qrCode: qrCodeSharp
      },
      invitations: filteredInvitations,
      search,
      isLoading: fetching,
      doRefresh
    };
  }
});
</script>
