// 8. Get the post with ID of 1 via API request, at the same time get comments for post ID of 1 via another API request
/**
 * @description Get the post with ID of 1 via API request, at the same time get comments for post ID of 1 via another API request
 * @returns {Promise<void>}
 */
async function getPostWithComments() {
    try {
        const [postResponse, commentsResponse] = await Promise.all([
            fetch("https://jsonplaceholder.typicode.com/posts/1"),
            fetch("https://jsonplaceholder.typicode.com/comments?postId=1")
        ]);

        const [post, comments] = await Promise.all([
            postResponse.json(),
            commentsResponse.json()
        ]);

        const postWithComments = {
            ...post,
            comments: comments
        };
        console.log(JSON.stringify(postWithComments, null, 2));
    } catch (error) {
        console.error("Error fetching post or comments:", error);
    }
}

getPostWithComments();