// 2. Get data from all users from API above
async function getUsers() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await response.json();
    console.log(users);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

getUsers();
