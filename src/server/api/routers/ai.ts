import { eq } from 'drizzle-orm';
import { GoogleGenAI } from '@google/genai';
///TODO: should probably be protectedProcedure
import { createTRPCRouter, publicProcedure } from '../trpc';
import { z } from 'zod';
import { club } from '@src/server/db/schema/club';

const formSchema = z.object({
  major: z.string().min(1),
  year: z.string().min(1),
  proximity: z.string().min(1),
  categories: z.array(z.string().min(1)),
  specificCultures: z.string().optional(),
  hobbies: z.array(z.string().min(1)),
  hobbiesOther: z.string().optional(),
  hobbyDetails: z.string().optional(),
  otherAcademicInterests: z.string().optional(),
  gender: z.string().min(1),
  genderOther: z.string().optional(),
  newExperiences: z.string().optional(),
  involvementGoals: z.array(z.string().min(1)).optional(),
  timeCommitment: z.string().min(1),
  skills: z.array(z.string().min(1)).optional(),
});

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
  clubMatch: publicProcedure.input(formSchema).query(async ({ ctx, input }) => {
    try {
      const { categories, ...questions } = input;

      const query = ctx.db
        .select()
        .from(club)
        .orderBy(club.name)
        .where(eq(club.approved, 'approved'));

      const clubs = await query.execute();

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

Student Profile:
- Preferred Categories: ${categories.join(', ')}

Filtered Q&A:
${JSON.stringify(questions, null, 2)}

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
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      if (typeof response.text === 'undefined') {
        throw new Error('undefined response');
      }

      const result = JSON.parse(response.text) as {
        name: string;
        id: string;
        reasoning: string;
        benefit: string;
      }[];

      //TODO: save to profile

      return result;
    } catch (e) {
      console.error('Gemini Error:', e);
      throw e;
    }
  }),
});
