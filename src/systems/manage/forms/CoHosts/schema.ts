import { z } from 'zod';

export const editCoHostsSchema = z.object({
    coHosts: z
        .object({
            clubId: z.string(),
            status: z.enum(['Approved', 'Pending', 'Rejected']),
            inviteDate: z.date(),
            responseDate: z.date().nullable().optional(),
        })
        .array(),
});