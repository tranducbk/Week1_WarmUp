// 4. Filter only users with more than 3 comments.
/**
 * @description Filter only users with more than 3 comments
 * @returns {Promise<void>}
 */
async function getUsersWithMoreThan3Comments() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await response.json();

    const usersWithPosts = await Promise.all(
      users.map(async (user) => {
        try {
          const postsResponse = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`);
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

    // Lọc users có hơn 3 comments
    const usersWithMoreThan3Comments = finalData.filter((user) => {
      return (
        user.comments &&
        Array.isArray(user.comments) &&
        user.comments.length > 3
      );
    });

    if (usersWithMoreThan3Comments.length > 0) {
      const reformattedUsers = usersWithMoreThan3Comments.map(user => {
        const { posts, comments, id, name, username, email, ...restOfUser } = user;
        return {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          comments,
          posts
        }
      });
      console.log(JSON.stringify(reformattedUsers, null, 2));
    } else {
      console.log("No users found with more than 3 comments.");
    }
  } catch (error) {
    console.error("An error occurred during processing:", error);
  }
}

getUsersWithMoreThan3Comments();
