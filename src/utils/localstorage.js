export const saveUserData = (userData) => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const existingUserIndex = users.findIndex(user => user.email === userData.email);
  
  if (existingUserIndex >= 0) {
    users[existingUserIndex] = userData;
  } else {
    users.push(userData);
  }
  
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(userData));
};

export const getUserData = (email) => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  return users.find(user => user.email === email);
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('currentUser'));
};

export const clearCurrentUser = () => {
  localStorage.removeItem('currentUser');
};

export const authenticateUser = (email, password) => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  return users.find(user => user.email === email && user.password === password);
};

// Nouvelle fonction pour mettre à jour la photo de profil
export const updateProfileImage = (email, imageUrl) => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userIndex = users.findIndex(user => user.email === email);
  
  if (userIndex >= 0) {
    users[userIndex].profileImage = imageUrl;
    localStorage.setItem('users', JSON.stringify(users));
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.email === email) {
      currentUser.profileImage = imageUrl;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    return true;
  }
  return false;
};