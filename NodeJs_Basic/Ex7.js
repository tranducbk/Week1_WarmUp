// 7. Sort the list of users by the postsCount value descending?
fetch("https://jsonplaceholder.typicode.com/users")
  .then((response) => response.json())
  .then((users) => {
    const promisesToGetPosts = users.map((user) => {
      return fetch(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`)
        .then(res => {
          if (!res.ok) {
            return []; 
          }
          return res.json();
        })
        .then(posts => {
          return { ...user, posts: posts };
        })
        .catch(error => {
          return { ...user, posts: [], errorFetchingPosts: true };
        });
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
          .then(res => {
            if (!res.ok) {
              return [];
            }
            return res.json();
          })
          .catch(error => {
            return [];
          });
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
            postCount: posts ? posts.length : 0,
            commentCount: comments ? comments.length : 0
        };
    });

    if (reformattedUsers.length > 0) {
        const sortedByPosts = [...reformattedUsers].sort((a, b) => b.postCount - a.postCount);
        console.log(JSON.stringify(sortedByPosts, null, 2));
    } else {
        console.log("Không có người dùng nào thỏa mãn điều kiện.");
    }
  })
  .catch(error => {
    console.error("Đã xảy ra lỗi tổng thể trong quá trình xử lý:", error);
  });