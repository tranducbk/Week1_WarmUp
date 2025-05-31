// 6. Who is the user with the most comments/posts?
fetch("https://jsonplaceholder.typicode.com/users")
  .then((response) => response.json())
  .then((users) => {
    const promisesToGetPosts = users.map((user) => {
      return fetch(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`)
        .then(res => {
          if (!res.ok) {
            console.error(`Lỗi khi lấy posts cho user ${user.id}: ${res.status}`);
            return []; 
          }
          return res.json();
        })
        .then(posts => {
          return { ...user, posts: posts };
        })
        .catch(error => {
          console.error(`Lỗi trong quá trình xử lý posts cho user ${user.id}:`, error);
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
              console.error(`Lỗi khi lấy comments cho post ${post.id}: ${res.status}`);
              return [];
            }
            return res.json();
          })
          .catch(error => {
            console.error(`Lỗi khi xử lý comments cho post ${post.id}:`, error);
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
        let userWithMostComments = reformattedUsers[0];
        for (let i = 1; i < reformattedUsers.length; i++) {
            if (reformattedUsers[i].commentCount > userWithMostComments.commentCount) {
                userWithMostComments = reformattedUsers[i];
            }
        }
        console.log(`Who is the user with the most comments?`);
        console.log(`Tên: ${userWithMostComments.name}, ID: ${userWithMostComments.id}, Số bình luận: ${userWithMostComments.commentCount}`);

        let userWithMostPosts = reformattedUsers[0];
        for (let i = 1; i < reformattedUsers.length; i++) {
            if (reformattedUsers[i].postCount > userWithMostPosts.postCount) {
                userWithMostPosts = reformattedUsers[i];
            }
        }
        console.log(`Who is the user with the most posts?`);
        console.log(`Tên: ${userWithMostPosts.name}, ID: ${userWithMostPosts.id}, Số bài viết: ${userWithMostPosts.postCount}`);
    } else {
        console.log("Không có người dùng nào thỏa mãn điều kiện.");
    }
  })
  .catch(error => {
    console.error("Đã xảy ra lỗi trong quá trình xử lý:", error);
  });