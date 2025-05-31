// 3. Get all the posts and comments from the API
fetch("https://jsonplaceholder.typicode.com/users")
  .then((response) => response.json())
  .then((users) => {
    const promisesToGetPosts = users.map((user) => {
      return fetch(
        `https://jsonplaceholder.typicode.com/posts?userId=${user.id}`
      )
        .then((res) => {
          if (!res.ok) {
            console.error(
              `Lỗi khi lấy posts cho user ${user.id}: ${res.status}`
            );
            return [];
          }
          return res.json();
        })
        .then((posts) => {
          return { ...user, posts: posts };
        })
        .catch((error) => {
          console.error(
            `Lỗi trong quá trình xử lý posts cho user ${user.id}:`,
            error
          );
          return { ...user, posts: [], errorFetchingPosts: true };
        });
    });

    return Promise.all(promisesToGetPosts);
  })
  .then((usersWithPosts) => {
    const promisesToGetComments = usersWithPosts.map((user) => {
      if (!user.posts || user.posts.length === 0) {
        return Promise.resolve({ ...user, comments: [] });
      }
      const commentFetchPromisesForUser = user.posts.map((post) => {
        return fetch(
          `https://jsonplaceholder.typicode.com/comments?postId=${post.id}`
        )
          .then((res) => {
            if (!res.ok) {
              console.error(
                `Lỗi khi lấy comments cho post ${post.id}: ${res.status}`
              );
              return [];
            }
            return res.json();
          })
          .catch((error) => {
            console.error(`Lỗi khi xử lý comments cho post ${post.id}:`, error);
            return [];
          });
      });

      return Promise.all(commentFetchPromisesForUser).then(
        (arraysOfComments) => {
          const allCommentsForUser = arraysOfComments.flat();
          return { ...user, comments: allCommentsForUser };
        }
      );
    });

    return Promise.all(promisesToGetComments);
  })
  .then((finalData) => {
    const reformattedUsers = finalData.map(user => {
      const { posts, comments, id, name, username, email, ...restOfUser } = user;
      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        comments,
        posts
      }
    })
    console.log(JSON.stringify(reformattedUsers, null, 2));
  })
  .catch((error) => {
    console.error("Đã xảy ra lỗi trong quá trình xử lý:", error);
  });
