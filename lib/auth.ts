import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// Reuse same session/callback logic as in the NextAuth route
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectDB();
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
          return null;
        }
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone ?? null,
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.name = (user as any).name;
        token.email = (user as any).email;
        token.phone = (user as any).phone ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: (token as any).id as string,
          name: (token as any).name as string,
          email: (token as any).email as string,
          phone: (token as any).phone as number | null,
        };
      }
      return session;
    },
  },
  pages: { signIn: '/auth/signin' },
};
