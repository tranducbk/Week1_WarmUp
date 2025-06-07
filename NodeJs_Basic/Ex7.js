// 7. Sort the list of users by the postsCount value descending?
/**
 * @description Sort users by post count in descending order
 * @returns {Promise<void>}
 */
async function sortUsersByPostCount() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await response.json();

    const usersWithPosts = await Promise.all(
      users.map(async (user) => {
        try {
          const postsResponse = await fetch(
            `https://jsonplaceholder.typicode.com/posts?userId=${user.id}`
          );
          if (!postsResponse.ok) {
            return { ...user, posts: [] };
          }
          const posts = await postsResponse.json();
          return { ...user, posts: posts };
        } catch (error) {
          console.error(`Error processing posts for user ${user.id}:`, error);
          return { ...user, posts: [] };
        }
      })
    );

    const finalData = await Promise.all(
      usersWithPosts.map(async (user) => {
        if (!user.posts || user.posts.length === 0) {
          return { ...user, comments: [] };
        }

        try {
          const commentPromises = user.posts.map(async (post) => {
            try {
              const commentsResponse = await fetch(
                `https://jsonplaceholder.typicode.com/comments?postId=${post.id}`
              );
              if (!commentsResponse.ok) {
                return [];
              }
              return await commentsResponse.json();
            } catch (error) {
              console.error(`Error processing comments for post ${post.id}:`, error);
              return [];
            }
          });

          const arraysOfComments = await Promise.all(commentPromises);
          const allCommentsForUser = arraysOfComments.flat();
          return { ...user, comments: allCommentsForUser };
        } catch (error) {
          console.error(`Error processing comments for user ${user.id}:`, error);
          return { ...user, comments: [] };
        }
      })
    );

    const reformattedUsers = finalData.map(user => {
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
      console.log("No users found.");
    }
  } catch (error) {
    console.error("An error occurred during processing:", error);
  }
}

sortUsersByPostCount();