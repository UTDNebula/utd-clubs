import { GoogleGenAI } from '@google/genai';
import { eq } from 'drizzle-orm';
import { club } from '@src/server/db/schema/club';
import {
  userAiCache,
  type ClubMatchResults,
} from '@src/server/db/schema/users';
import { clubMatchFormSchema } from '@src/utils/formSchemas';
import { createTRPCRouter, protectedProcedure } from '../trpc';

const GEMINI_SERVICE_ACCOUNT = JSON.parse(
  process.env.GEMINI_SERVICE_ACCOUNT as string,
) as { client_email: string; private_key: string };
const ai = new GoogleGenAI({
  vertexai: true,
  project: 'jupiter-459023',
  location: 'us-central1',
  googleAuthOptions: {
    credentials: {
      client_email: GEMINI_SERVICE_ACCOUNT.client_email,
      private_key: GEMINI_SERVICE_ACCOUNT.private_key,
    },
  },
});

export const aiRouter = createTRPCRouter({
  clubMatch: protectedProcedure
    .input(clubMatchFormSchema)
    .mutation(async ({ ctx, input }) => {
      // Limit to 100 calls to avoid spam
      if (process.env.NODE_ENV !== 'development') {
        const existing = await ctx.db.query.userAiCache.findFirst({
          where: eq(userAiCache.id, ctx.session.user.id),
        });

        if (existing && existing.clubMatchLimit != null) {
          if (existing.clubMatchLimit > 0) {
            await ctx.db
              .update(userAiCache)
              .set({
                clubMatchLimit: existing.clubMatchLimit - 1,
              })
              .where(eq(userAiCache.id, ctx.session.user.id));
          } else {
            return;
          }
        } else {
          await ctx.db
            .insert(userAiCache)
            .values({
              id: ctx.session.user.id,
              clubMatchLimit: 100,
            })
            .onConflictDoUpdate({
              target: userAiCache.id,
              set: {
                clubMatchLimit: 100,
              },
            });
        }
      }

      // Get all clubs
      const clubs = await ctx.db
        .select()
        .from(club)
        .orderBy(club.name)
        .where(eq(club.approved, 'approved'));

      const prompt = `Analyze this student's preferences and recommend 10 organizations,
ensuring balanced coverage across all selected categories:

Available Organizations:
${JSON.stringify(
  clubs.map(({ id, name, description, tags }) => ({
    id,
    name,
    description,
    tags,
  })),
  null,
  2,
)}

Student Q&A:
${JSON.stringify(input, null, 2)}

Recommendation Requirements:
1. Prioritize category distribution - include organizations from each selected category proportionally
2. Never suggest more than 3 organizations from the same category unless essential
3. Consider all organizations equally regardless of their position in the list
4. Highlight unique value propositions for similar organizations in the same category

Format the recommendations as a JSON array and each recommendation as:
name: Organization Name
id: Organization ID
reasoning: Match reasoning in concise 1-line explanation
benefit: Key benefits in 2-3 comma-separated points

Maintain strict formatting:
- The ONLY output is the recommendations
- No markdown or special characters
- Organize recommendations with the JSON format
- Keep tone encouraging but professional
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-lite',
        contents: prompt,
      });

      if (typeof response.text === 'undefined') {
        throw new Error('undefined response');
      }

      const result = JSON.parse(
        response.text.replaceAll('```json', '').replaceAll('```', ''),
      ) as ClubMatchResults;

      //Save to profile
      await ctx.db
        .insert(userAiCache)
        .values({
          id: ctx.session.user.id,
          clubMatch: result,
        })
        .onConflictDoUpdate({
          target: userAiCache.id,
          set: {
            clubMatch: result,
          },
        });
    }),
});
