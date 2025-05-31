// 5. Reformat the data with the count of comments and posts
fetch("https://jsonplaceholder.typicode.com/users")
  .then((response) => response.json())
  .then((users) => {
    const promisesToGetPosts = users.map((user) => {
      return fetch(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`)
        .then(res => res.ok ? res.json() : [])
        .then(posts => ({ ...user, posts }))
        .catch(() => ({ ...user, posts: [] }));
    });
    return Promise.all(promisesToGetPosts);
  })
  .then((usersWithPosts) => {
    const promisesToGetComments = usersWithPosts.map(user => {
      if (!user.posts || user.posts.length === 0) {
        return Promise.resolve({ ...user, comments: [] });
      }
      const commentFetchPromisesForUser = user.posts.map(post => {
        return fetch(`https://jsonplaceholder.typicode.com/comments?postId=${post.id}`)
          .then(res => res.ok ? res.json() : [])
          .catch(() => []);
      });
      return Promise.all(commentFetchPromisesForUser)
        .then(arraysOfComments => {
          const allCommentsForUser = arraysOfComments.flat();
          return { ...user, comments: allCommentsForUser };
        });
    });
    return Promise.all(promisesToGetComments);
  })
  .then(finalDataBeforeFiltering => {
    const reformattedUsers = finalDataBeforeFiltering.map(user => {
      const { posts, comments, id, name, username, email, ...restOfUser } = user;
      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        commentsCount: comments ? comments.length : 0,
        postsCount: posts ? posts.length : 0
      };
    });
    console.log(reformattedUsers);
  })
  .catch(error => {
    console.error("Đã xảy ra lỗi trong quá trình xử lý:", error);
  });