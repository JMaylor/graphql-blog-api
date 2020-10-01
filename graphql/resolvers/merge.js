const Post = require("../../models/post");
const User = require("../../models/user");

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

const transformPost = (post) => {
    return {
        ...post._doc,
        _id: post.id,
        author: user.bind(this, post.author),
    };
};

module.exports = transformPost