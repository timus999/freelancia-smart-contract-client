import { formatDistanceToNow } from 'date-fns';

export const timeAgo = (time: string) => {
    return formatDistanceToNow(new Date(time), { addSuffix: true });
}