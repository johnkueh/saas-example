import _ from 'lodash';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import uuidv4 from 'uuid/v4';
import ValidationErrors from '../helpers/validation-errors';
import sendEmail from '../services/sendgrid';

export default {
  Query: {
    async me(parent, args, { user, prisma }, info) {
      return prisma.user({ id: user.id });
    }
  },
  Mutation: {
    async signup(parent, { input }, { prisma }, info) {
      const { name, email, password } = input;
      const existingUser = await prisma.user({ email });

      if (existingUser) {
        throw ValidationErrors({
          email: 'Email is already taken'
        });
      } else {
        const user = await prisma.createUser({
          name,
          email,
          password: hashedPassword(password)
        });

        return {
          user,
          jwt: getJwt({
            id: user.id,
            email: user.email
          })
        };
      }
    },
    async login(parent, { input }, { prisma }, info) {
      const { email, password } = input;
      const user = await prisma.user({ email });

      if (user && bcrypt.compareSync(password, user.password)) {
        return {
          user,
          jwt: getJwt({
            id: user.id,
            email: user.email
          })
        };
      }

      throw ValidationErrors({
        auth: 'Please check your credentials and try again.'
      });
    },
    async forgotPassword(parent, { input }, { prisma }, info) {
      const { email } = input;
      const user = await prisma.user({ email });

      if (user) {
        const { email: userEmail } = user;
        const token = uuidv4();

        await prisma.updateUser({
          where: { email },
          data: { resetPasswordToken: token }
        });

        sendEmail({
          template_id: process.env.FORGOT_PASSWORD_TEMPLATE_ID,
          to: userEmail,
          from: process.env.SUPPORT_EMAIL_ADDRESS,
          dynamic_template_data: {
            email: userEmail,
            resetPasswordLink: `https://app.zapcms.com/reset-password?token=${token}`
          }
        });
      }

      return {
        message: 'A link to reset your password will be sent to your registered email.'
      };
    },
    async resetPassword(parent, { input }, { prisma }, info) {
      const { password, repeatPassword, token } = input;

      if (password !== repeatPassword) {
        throw ValidationErrors({
          password: 'Repeated password does not match new password.'
        });
      }

      const dbUser = await prisma.user({ resetPasswordToken: token });

      if (dbUser) {
        await prisma.updateUser({
          where: { resetPasswordToken: token },
          data: {
            password: hashedPassword(password),
            resetPasswordToken: null
          }
        });

        return {
          message: 'Password updated successfully. You may now login with your new password.'
        };
      }

      throw new ValidationErrors({ token: 'Password reset token is invalid.' });
    },
    async updateUser(parent, { input }, { user, prisma }, info) {
      const { name, email, password } = input;

      if (password) {
        return prisma.updateUser({
          where: { id: user.id },
          data: {
            name,
            email,
            password: hashedPassword(password)
          }
        });
      }

      return prisma.updateUser({
        where: { id: user.id },
        data: {
          name,
          email
        }
      });
    },
    async deleteUser(
      parent,
      args,
      {
        user: { id },
        prisma
      },
      info
    ) {
      return prisma.deleteUser({ id });
    }
  }
};

const hashedPassword = password => bcrypt.hashSync(password, 10);
const getJwt = ({ id, email }) => jsonwebtoken.sign({ id, email }, process.env.JWT_SECRET);
