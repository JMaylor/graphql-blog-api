const Post = require("../../models/post");
const User = require("../../models/user");
const transformPost = require("./merge");

// Root resolver
const postResolver = {
    posts: async () => {
        try {
            const posts = await Post.find();
            return posts.map(transformPost);
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    createPost: async (args, req) => {
		if (!req.isAuth) {
			throw new Error('Unauthenticated!')
		}
        const post = new Post({
            ...args.postInput,
            author: req.userID,
		});
		let createdPost;
        try {
            const result = await post.save();
			createdPost = transformPost(result);
			const author = await User.findById(req.userID);
            author.createdPosts.push(post);
			await author.save();
            return createdPost;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
};

module.exports = postResolver;
