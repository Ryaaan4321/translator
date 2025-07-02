import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt'
import client from '@/app/db'; 

export const NEXT_AUTH_CONFIG = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await client.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email
        };
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async ({ user, token }: any) => {
      if (user) {
        let dbuser;
        if (user.id) {
          dbuser = user;
        } else {
          dbuser = await client.user.findUnique({
            where: { email: user.email }
          });

          if (!dbuser) {
            dbuser = await client.user.create({
              data: {
                name:user.name || "new user",
                username: `user_${Math.random().toString(36).substring(7)}`,
                email: user.email,
                password: "******", 
                phonenumber: "999999999"
              }
            });
          }
        }

        token.uid = dbuser.id;
      }

      return token;
    },
    session: ({ session, token }: any) => {
      if (session.user) {
        session.user.id = token.uid;
      }
      return session;
    },
    redirect: async ({ url, baseUrl }: { url: string; baseUrl: string }) => {
      return `${baseUrl}/user`;
    }
  },
  pages: {
    signIn: "/user/signin", 
  }
};
