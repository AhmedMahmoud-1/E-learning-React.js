// utils/localstorage2.js

// Fonctions pour les cours
export const getCourses = () => {
  const courses = localStorage.getItem('teacherCourses');
  return courses ? JSON.parse(courses) : [];
};

export const addCourse = (course) => {
  const courses = getCourses();
  
  const courseToStore = {
    ...course,
    id: course.id || generateId(),
    date: course.date || new Date().toISOString(),
    mainImage: course.mainImage ? {
      ...course.mainImage,
      url: course.mainImage.url || URL.createObjectURL(course.mainImage.file)
    } : null,
    documents: course.documents ? course.documents.map(doc => ({
      ...doc,
      url: doc.url || URL.createObjectURL(doc.file)
    })) : []
  };

  courses.push(courseToStore);
  localStorage.setItem('teacherCourses', JSON.stringify(courses));
  return courseToStore;
};

export const deleteCourse = (courseId) => {
  const courses = getCourses().filter(course => course.id !== courseId);
  localStorage.setItem('teacherCourses', JSON.stringify(courses));
  return courses;
};

export const updateCourse = (courseId, updates) => {
  const courses = getCourses();
  const courseIndex = courses.findIndex(c => c.id === courseId);
  
  if (courseIndex === -1) return null;
  
  const updatedCourse = {
    ...courses[courseIndex],
    ...updates,
    id: courseId // Garantir qu'on ne modifie pas l'ID
  };
  
  courses[courseIndex] = updatedCourse;
  localStorage.setItem('teacherCourses', JSON.stringify(courses));
  return updatedCourse;
};

// Fonctions pour les étudiants
export const getStudentCourses = (studentEmail) => {
  if (!studentEmail) return [];
  const studentCourses = localStorage.getItem('studentCourses');
  return studentCourses ? JSON.parse(studentCourses)[studentEmail] || [] : [];
};

export const addStudentCourse = (studentEmail, courseId) => {
  if (!studentEmail || !courseId) return false;

  const allStudentCourses = localStorage.getItem('studentCourses') 
    ? JSON.parse(localStorage.getItem('studentCourses'))
    : {};
  
  const studentCourses = allStudentCourses[studentEmail] || [];
  
  // Stocker à la fois l'ID du cours et la date d'accès
  if (!studentCourses.some(sc => typeof sc === 'object' ? sc.courseId === courseId : sc === courseId)) {
    studentCourses.push({
      courseId,
      accessTime: new Date().toISOString()
    });
    allStudentCourses[studentEmail] = studentCourses;
    localStorage.setItem('studentCourses', JSON.stringify(allStudentCourses));
    return true;
  }
  return false;
};

// Fonctions pour les commentaires
export const getCourseComments = (courseId) => {
  if (!courseId) return [];
  const allComments = localStorage.getItem('courseComments');
  return allComments ? JSON.parse(allComments).filter(comment => comment.courseId === courseId) : [];
};

export const addCourseComment = (courseId, commentData) => {
  if (!courseId || !commentData?.author || !commentData?.text) return null;

  const allComments = localStorage.getItem('courseComments') 
    ? JSON.parse(localStorage.getItem('courseComments'))
    : [];

  const newComment = {
    id: generateId(),
    courseId,
    author: commentData.author,
    text: commentData.text,
    date: new Date().toISOString(),
    authorEmail: commentData.authorEmail || null,
    authorAvatar: commentData.authorAvatar || null
  };

  const updatedComments = [...allComments, newComment];
  localStorage.setItem('courseComments', JSON.stringify(updatedComments));
  return newComment;
};

export const deleteCourseComment = (commentId) => {
  const allComments = localStorage.getItem('courseComments') 
    ? JSON.parse(localStorage.getItem('courseComments'))
    : [];

  const updatedComments = allComments.filter(comment => comment.id !== commentId);
  localStorage.setItem('courseComments', JSON.stringify(updatedComments));
  return updatedComments;
};

export const updateCourseComment = (commentId, newText) => {
  if (!commentId || !newText) return null;

  const allComments = localStorage.getItem('courseComments') 
    ? JSON.parse(localStorage.getItem('courseComments'))
    : [];

  const commentIndex = allComments.findIndex(comment => comment.id === commentId);
  if (commentIndex === -1) return null;

  const updatedComment = {
    ...allComments[commentIndex],
    text: newText,
    edited: true,
    editDate: new Date().toISOString()
  };

  const updatedComments = [
    ...allComments.slice(0, commentIndex),
    updatedComment,
    ...allComments.slice(commentIndex + 1)
  ];

  localStorage.setItem('courseComments', JSON.stringify(updatedComments));
  return updatedComment;
};

// Fonctions pour les notes de cours
export const addCourseRating = (courseId, studentEmail, rating) => {
  const ratings = JSON.parse(localStorage.getItem('courseRatings')) || {};
  if (!ratings[courseId]) {
    ratings[courseId] = {};
  }
  ratings[courseId][studentEmail] = rating;
  localStorage.setItem('courseRatings', JSON.stringify(ratings));
};

export const getCourseRating = (courseId, studentEmail) => {
  const ratings = JSON.parse(localStorage.getItem('courseRatings')) || {};
  return ratings[courseId]?.[studentEmail] || 0;
};

export const getAverageCourseRating = (courseId) => {
  const ratings = JSON.parse(localStorage.getItem('courseRatings')) || {};
  const courseRatings = ratings[courseId] ? Object.values(ratings[courseId]) : [];
  if (courseRatings.length === 0) return 0;
  const sum = courseRatings.reduce((a, b) => a + b, 0);
  return (sum / courseRatings.length).toFixed(1);
};

export const getRatingCount = (courseId) => {
  const ratings = JSON.parse(localStorage.getItem('courseRatings')) || {};
  return ratings[courseId] ? Object.keys(ratings[courseId]).length : 0;
};

// Fonctions pour les notifications des professeurs
export const getTeacherNotifications = (teacherEmail) => {
  if (!teacherEmail) return [];
  const allNotifications = JSON.parse(localStorage.getItem('teacherNotifications')) || {};
  return allNotifications[teacherEmail] || [];
};

export const addTeacherNotification = (teacherEmail, title, message, courseId = null) => {
  const allNotifications = JSON.parse(localStorage.getItem('teacherNotifications')) || {};
  
  if (!allNotifications[teacherEmail]) {
    allNotifications[teacherEmail] = [];
  }
  
  const newNotification = {
    id: generateId(),
    title,
    message,
    courseId,
    date: new Date().toISOString(),
    read: false
  };
  
  allNotifications[teacherEmail].unshift(newNotification);
  
  // Limiter à 50 notifications par professeur
  allNotifications[teacherEmail] = allNotifications[teacherEmail].slice(0, 50);
  
  localStorage.setItem('teacherNotifications', JSON.stringify(allNotifications));
  return newNotification;
};

export const markNotificationAsRead = (teacherEmail, notificationId) => {
  const allNotifications = JSON.parse(localStorage.getItem('teacherNotifications')) || {};
  
  if (allNotifications[teacherEmail]) {
    const notificationIndex = allNotifications[teacherEmail].findIndex(n => n.id === notificationId);
    if (notificationIndex !== -1) {
      allNotifications[teacherEmail][notificationIndex].read = true;
      localStorage.setItem('teacherNotifications', JSON.stringify(allNotifications));
      return true;
    }
  }
  return false;
};

export const deleteTeacherNotification = (teacherEmail, notificationId) => {
  const allNotifications = JSON.parse(localStorage.getItem('teacherNotifications')) || {};
  
  if (allNotifications[teacherEmail]) {
    const initialLength = allNotifications[teacherEmail].length;
    allNotifications[teacherEmail] = allNotifications[teacherEmail].filter(n => n.id !== notificationId);
    
    if (allNotifications[teacherEmail].length !== initialLength) {
      localStorage.setItem('teacherNotifications', JSON.stringify(allNotifications));
      return true;
    }
  }
  return false;
};

export const getUnreadNotificationsCount = (teacherEmail) => {
  if (!teacherEmail) return 0;
  const notifications = getTeacherNotifications(teacherEmail);
  return notifications.filter(n => !n.read).length;
};

// Fonction utilitaire
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};



// Fonction pour nettoyer les URLs créées avec URL.createObjectURL
export const revokeObjectUrls = (course) => {
  if (course.mainImage?.url && course.mainImage.url.startsWith('blob:')) {
    URL.revokeObjectURL(course.mainImage.url);
  }
  
  if (course.documents) {
    course.documents.forEach(doc => {
      if (doc.url && doc.url.startsWith('blob:')) {
        URL.revokeObjectURL(doc.url);
      }
    });
  }
};