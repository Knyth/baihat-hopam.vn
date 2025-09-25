// auth.config.js
export const authConfig = {
  pages: { signIn: "/auth" },
  providers: [],
  callbacks: {
    // Chúng ta vẫn cần 2 callbacks này để session có id
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user.id = token.id;
      return session;
    },
  },
};
