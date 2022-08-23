import {gql} from "@urql/vue";

export const ALL_INVITATIONS_QUERY = gql`
    query GetAllInvitations {
        invitations {
            guest_code
            name
            full_name
            guests
            pax
            group {
                name
            }
            seating {
                name
            }
            attendance {
                serial_number
                created_at
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
                seating {
                    name
                }
                attendance {
                    serial_number
                    created_at
                }
            }
        }
    }
`;
