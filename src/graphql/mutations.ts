import {gql} from "@urql/vue";

export const CHECKIN_MUTATION = gql`
    mutation (
        $guest_code: String!,
        $sequence_group: String,
        $has_gift: Boolean,
        $notes: String
    ) {
        checkIn(
            guest_code: $guest_code,
            sequence_group: $sequence_group,
            has_gift: $has_gift
            notes: $notes
        ) {
            attendance {
                serial_number
                checkin_time
                has_gift
                notes
            }
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
                    serial_number
                    created_at
                    checkin_time
                    has_gift
                }
            }
        }
    }
`;
