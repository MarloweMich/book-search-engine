const { Book, User } = require('../models');

const resolvers = {
    Query: {
        users: async () => {
          return User.find().populate('savedBooks');
        },
        user: async (parent, { username }) => {
          return User.findOne({ username }).populate('savedBooks');
        },
        books: async (parent, { title }) => {
          const params = title ? { title } : {};
          return Book.find(params).sort({ createdAt: -1 });
        },
        Book: async (parent, { bookId }) => {
          return Thought.findOne({ _id: bookId });
        },
        me: async (parent, args, context) => {
          if (context.user) {
            return User.findOne({ _id: context.user._id }).populate('thoughts');
          }
          throw new AuthenticationError('You need to be logged in!');
        },
      },
    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
      
            if (!user) {
              throw new AuthenticationError('No user found with this email address');
            }
      
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
              throw new AuthenticationError('Incorrect credentials');
            }
      
            const token = signToken(user);
      
            return { token, user };
          },
          
          addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
          },
          
          saveBook: async (parent, { bookId, authors, description, image, link, title }, context) => {
            if (context.user) {
              return Book.findOneAndUpdate(
                { _id: bookId },
                {
                  $addToSet: {
                    savedBooks: { authors, description, image, link, title },
                  },
                },
                {
                  new: true,
                  runValidators: true,
                }
              );
            }
            throw new AuthenticationError('You need to be logged in!');
          },
          
          removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
              return Book.findOneAndUpdate(
                { _id: thoughtId },
                {
                  $pull: {
                    savedBooks: {
                      _id: bookId,
                    },
                  },
                },
                { new: true }
              );
            }
            throw new AuthenticationError('You need to be logged in!');
          },
    },
};

module.exports = resolvers;