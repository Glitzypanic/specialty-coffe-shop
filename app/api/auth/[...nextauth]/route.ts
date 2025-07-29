// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// Extend NextAuth types
declare module 'next-auth' {
  interface User {
    phone?: number | null;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      phone: number | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    phone: number | null;
  }
}

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
          return null; // Devuelve null para indicar fallo
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
  session: {
    strategy: 'jwt', // Usa JWT para sesiones ligeras y rápidas
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.phone = user.phone ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
          phone: token.phone as number | null,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin', // Redirige a la página de login si falla
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
