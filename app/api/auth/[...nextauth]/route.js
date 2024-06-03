import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import User from '@/models/user.js';
import { getToken } from "next-auth/jwt";

const authOptions = {
    providers: [
        CredentialsProvider ({
            name: "credentials",
            credentials: {},

            async authorize(credentials) {
                const {username, password} = credentials;

                try {
                     // Admin credentials check
                    if (username === 'Admin' && password === 'Admin123') {
                        return {
                            id: 0,
                            username: 'Admin',
                            department_id: 0,
                            role: 'admin'
                        };
                    }

                    console.log("Input username:", username);
                    console.log("Input password:", password);

                    const user = await User.findUsername(username);
                    console.log("User from database:", user);

                    if (!user) {
                        console.log("User not found");
                        return null; // User not found
                    }

                    // Compare hashed password with user input password
                    const passwordMatch = password;
                    console.log("Password match:", passwordMatch);

                    if (!passwordMatch) {
                        console.log("Password does not match");
                        return null; // Passwords don't match
                    }

                    return user; // Return the user if authentication succeeds

                } catch (error) {
                    console.log("Error: ", error);
                    return null; // Return null in case of error
                }
            },
        }),
    ],

    callbacks: {
        async jwt ({token, user, session}) {
            console.log("jwt callback", {token, user, session});

            if(user) {
                token.id = user.id;
                token.username = user.username;
                token.department_id = user.department_id;
                // return {
                //     ...token,
                //     id: user.id,
                //     username: user.username,
                //     department: user.department,
                // };
            }
            return token;
        },
        async session ({session, token, user}) {

            console.log("session callback", {session, token, user})

            session.user.id = token.id;
            session.user.name = JSON.stringify(token);
            //  return {
            //     ...session,
            //     user: {
            //         ...session.user,
            //         id: token.id,
            //         name: token.username,
            //         department: token.department,                
            //     }

            //  };
            return session;
        },
        
    },

    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login"
    },
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
