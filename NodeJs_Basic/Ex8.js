// 8. Get the post with ID of 1 via API request, at the same time get comments for post ID of 1 via another API request
Promise.all([
    fetch("https://jsonplaceholder.typicode.com/posts/1"),
    fetch("https://jsonplaceholder.typicode.com/comments?postId=1")
])
.then(([postResponse, commentsResponse]) => {
    return Promise.all([
        postResponse.json(),
        commentsResponse.json()
    ]);
})
.then(([post, comments]) => {
    const postWithComments = {
        ...post,
        comments: comments
    };
    console.log(JSON.stringify(postWithComments, null, 2));
})
.catch(error => {
    console.error("Error fetching post or comments:", error);
});