import GoogleProvider from "next-auth/providers/google";
import client from '@/app/db';

export const NEXT_AUTH_CONFIG = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        jwt: async ({ user, token }: any) => {
            if (user) {
                let dbuser = await client.user.findUnique({
                    where: { email: user.email }
                });
                if (!dbuser) {
                    dbuser = await client.user.create({
                        data: {
                            name: user.name || "No Name",
                            username: `user_${Math.random().toString(36).substring(7)}`,
                            email: user.email,
                            password: "******",
                            phonenumber: "999999999",
                            profession: "enter your profession"
                        }
                    });
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
        signIn: 'auth/user/signin',
    }
};