import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { API_URL } from "@/config";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      authorize: async (credentials) => {
        const { ...values } = credentials;

        const url = `${API_URL}/user/login`;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const user = await response.json();

        if (response.ok) {
          // console.log("admin login", user);
          return user;
        } else {
          console.log("error", user);

          throw new Error(user.error);
        }
      },
    }),
  ],

  pages: {
    signIn: "/sign-in",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.token = user.token;
        token.id = user.id;
      }

      return token;
    },

    async session({ token, session }) {
      if (token) {
        session.user.token = token.token;
        session.user.id = token.id;
      }

      return session;
    },
  },
};

export default NextAuth(authOptions);
