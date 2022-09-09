import {gql} from "@urql/vue";

export const CHECKIN_MUTATION = gql`
    mutation CheckIn (
        $guest_code: String!,
        $sequence_group: String,
        $has_gift: Boolean,
        $notes: [String]
    ) {
        checkIn(
            guest_code: $guest_code,
            sequence_group: $sequence_group,
            has_gift: $has_gift
            notes: $notes
        ) {
            attendance {
                __typename
                id
                serial_number
                sequence_group
                checkin_time
                has_gift
                notes
            }
        }
    }
`;

export const DELETE_ATTENDANCE_MUTATION = gql`
    mutation DeleteAttendance (
        $id: ID!
    ) {
        deleteAttendance(
            id: $id
        ) {
            id
            serial_number
            sequence_group
            checkin_time
            has_gift
            notes
        }
    }
`;
