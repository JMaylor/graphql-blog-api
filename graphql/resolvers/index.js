const bcrypt = require("bcryptjs");

const Post = require("../../models/post");
const User = require("../../models/user");

const transformPost = (post) => {
    return {
        ...post._doc,
        _id: post.id,
        author: user.bind(this, post.author),
    };
};

const user = async (userID) => {
    try {
        const user = await User.findById(userID);
        return {
            ...user._doc,
            createdPosts: posts.bind(this, user._doc.createdPosts),
        };
    } catch (err) {
        throw err;
    }
};

const singlePost = async (postID) => {
    try {
        const post = await Post.findById(postID);
        return { ...post._doc, author: user.bind(this, post.author) };
    } catch (err) {
        throw err;
    }
};

const posts = async (postIDs) => {
    try {
        const posts = await Post.find({
            _id: { $in: postIDs },
        });
        return posts.map(transformPost);
    } catch (err) {
        throw err;
    }
};

// Root resolver
const rootValue = {
    posts: async () => {
        try {
            const posts = await Post.find();
            return posts.map(transformPost);
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    createPost: async (args) => {
		console.log(args);
        const post = new Post({
            ...args.postInput,
            author: "5f74ed51e6e0d617a0b0d9d4",
        });
        let createdPost;
        try {
            const result = await post.save();
            createdPost = transformPost(result);
            const author = await User.findById("5f74ed51e6e0d617a0b0d9d4");
            author.createdPosts.push(post);
			await author.save();
            return createdPost;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    createUser: async (args) => {
        try {
            const hashedPassword = await bcrypt.hash(
                args.userInput.password,
                12
            );
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword,
            });
            const result = await user.save();
            return { ...result._doc, password: null };
        } catch (err) {
            throw err;
        }
    },
};

module.exports = rootValue;