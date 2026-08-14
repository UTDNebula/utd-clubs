import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import { db } from '@/server/db';
import { clubRoleEnum } from '../db/schema/users';

type ClubRole = (typeof clubRoleEnum.enumValues)[number];

/**
 * Utility function to assert that a user has the minimum role required in {@linkcode roles}
 *
 * If the user lacks a required role in {@linkcode roles}, and `throwError` is true (default), an `UNAUTHORIZED` {@linkcode TRPCError} is thrown.
 *
 * @param userId User ID to check roles on
 * @param clubId Club ID to check permissions on
 * @param roles Dictionary defining whether each role is required. Can be a boolean or an object with additional customization options
 *
 * @throws `UNAUTHORIZED` {@linkcode TRPCError} if the user is missing a required role and `throwError` is true (default).
 */
export async function requireMemberRole(
  userId: string,
  clubId: string,
  roles: Partial<
    Record<
      ClubRole,
      | boolean
      | {
          /**
           * Custom error message to include in the thrown error if the user is missing this role.
           * @default `Must be a club ${"member" | "officer" | "admin"}`
           */
          errorMessage?: string;
          /**
           * Whether to throw an error if the user is missing this role.
           * Useful for conditionally enforcing a role based on input flags.
           * @default true
           */
          throwError?: boolean;
        }
    >
  >,
) {
  const member = await db.query.userMetadataToClubs.findFirst({
    where: (userMetadataToClubs) =>
      and(
        eq(userMetadataToClubs.userId, userId),
        eq(userMetadataToClubs.clubId, clubId),
      ),
  });

  const throwTRPCError = function (errorMessage: string) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: errorMessage,
    });
  };

  const handleRole = (
    role: ClubRole,
    missingRole: boolean,
    defaultErrorMessage: string,
  ) => {
    const roleRequired = roles[role];
    if (!roleRequired) return;

    const roleOptions = typeof roleRequired === 'boolean' ? {} : roleRequired;

    const throwError = roleOptions.throwError ?? true;

    if (missingRole && throwError) {
      return throwTRPCError(roleOptions.errorMessage ?? defaultErrorMessage);
    }
  };

  handleRole('Member', !member, 'Must be a club member');
  handleRole(
    'Officer',
    member?.memberType !== 'Officer' && member?.memberType !== 'President',
    'Must be a club officer',
  );
  handleRole(
    'President',
    member?.memberType !== 'President',
    'Must be a club admin',
  );
}
