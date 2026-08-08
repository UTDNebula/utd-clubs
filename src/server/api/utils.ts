import { and, eq } from 'drizzle-orm';
import { db } from '@/server/db';
import { TRPCError } from '@trpc/server';
import { clubRoleEnum } from '../db/schema/users';

type ClubRole = (typeof clubRoleEnum.enumValues)[number];

/**
 * Utility function to check if the specified user has the minimum role required in {@linkcode roles}
 * @param userId User to check roles on
 * @param clubId Club that the user must have the roles in
 * @param roles Dictionary defining whether each role is required. Can be a boolean or an object with additional customization options
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
           * The error message to return if the user is missing this role.
           * @default
           * `Must be a club ${"member" || "officer" || "admin"}`
           */
          errorMessage?: string;
          /**
           * Whether or not to throw an error if the user is missing this role.
           * @param missingRole Whether the user has a role lower than this role.
           * @returns Whether to throw the error.
           *
           * @default
           * (missingRole: boolean) => missingRole
           */
          throwError?: (missingRole: boolean) => boolean;
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

    const throwError =
      roleOptions.throwError ?? ((missingRole: boolean) => missingRole);

    if (throwError(missingRole)) {
      return throwTRPCError(roleOptions.errorMessage ?? defaultErrorMessage);
    }
  };

  handleRole('Member', !member, 'Must be a club member');
  handleRole(
    'Officer',
    member?.memberType === 'Member',
    'Must be a club officer',
  );
  handleRole(
    'President',
    member?.memberType !== 'President',
    'Must be a club admin',
  );
}
