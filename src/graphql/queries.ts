import {gql} from "@urql/vue";

export const ALL_INVITATIONS_QUERY = gql`
    query GetAllInvitations {
        invitations {
            guest_code
            name
            full_name
            guests
            pax
            is_family
            group {
                id
                group_name
            }
            seating {
                name
            }
            attendance {
                id
                serial_number
                created_at
                checkin_time
                has_gift
                notes
            }
        }
    }
`;

export const GROUPED_INVITATIONS_QUERY = gql`
    query GetGroupedInvitations {
        groupedInvitations {
            key
            invitations {
                guest_code
                name
                full_name
                guests
                pax
                is_family
                group {
                    group_name
                }
                seating {
                    name
                }
                attendance {
                    id
                    serial_number
                    created_at
                    checkin_time
                    has_gift
                    notes
                }
            }
        }
    }
`;

export const ALL_GROUPS_QUERY = gql`
    query GetAllGroups {
        groups {
            id
            group_name
        }
    }
`;
