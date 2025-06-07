// 6. Who is the user with the most comments/posts?
/**
 * @description Find users with the most comments and posts
 * @returns {Promise<void>}
 */
async function findUsersWithMostCommentsAndPosts() {
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
            console.error(
              `Error fetching posts for user ${user.id}: ${postsResponse.status}`
            );
            return { ...user, posts: [] };
          }
          const posts = await postsResponse.json();
          return { ...user, posts: posts };
        } catch (error) {
          console.error(
            `Error processing posts for user ${user.id}:`,
            error
          );
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
                console.error(
                  `Error fetching comments for post ${post.id}: ${commentsResponse.status}`
                );
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
      // Find users with most comments
      const maxComments = Math.max(...reformattedUsers.map(user => user.commentCount));
      const usersWithMostComments = reformattedUsers.filter(
        user => user.commentCount === maxComments
      );

      console.log(`Who are the users with the most comments? (${maxComments} comments)`);
      usersWithMostComments.forEach(user => {
        console.log(`Name: ${user.name}, ID: ${user.id}, Comments: ${user.commentCount}`);
      });

      // Find users with most posts
      const maxPosts = Math.max(...reformattedUsers.map(user => user.postCount));
      const usersWithMostPosts = reformattedUsers.filter(
        user => user.postCount === maxPosts
      );

      console.log(`\nWho are the users with the most posts? (${maxPosts} posts)`);
      usersWithMostPosts.forEach(user => {
        console.log(`Name: ${user.name}, ID: ${user.id}, Posts: ${user.postCount}`);
      });
    } else {
      console.log("No users found.");
    }
  } catch (error) {
    console.error("An error occurred during processing:", error);
  }
}

findUsersWithMostCommentsAndPosts();