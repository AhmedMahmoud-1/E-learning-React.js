import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, clearCurrentUser, updateProfileImage } from '../../utils/localStorage';
import { getCourses, deleteCourse } from '../../utils/localstorage2';
import { motion, AnimatePresence } from 'framer-motion';
import LogoPng from "../../assets/logo.png";

const HomeTeacher = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [courseAccessData, setCourseAccessData] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [expandedView, setExpandedView] = useState(false);
  const [comments, setComments] = useState([]);
  const [courseRatings, setCourseRatings] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Charger les notifications depuis le localStorage
  const loadNotifications = useCallback(() => {
    const storedNotifications = JSON.parse(localStorage.getItem('teacherNotifications')) || {};
    const userNotifications = storedNotifications[user?.email] || [];
    setNotifications(userNotifications);
  }, [user?.email]);

  // Marquer une notification comme lue
  const markNotificationAsRead = (index) => {
    const updatedNotifications = [...notifications];
    updatedNotifications[index].read = true;
    setNotifications(updatedNotifications);
    
    // Mettre à jour le localStorage
    const storedNotifications = JSON.parse(localStorage.getItem('teacherNotifications')) || {};
    storedNotifications[user.email] = updatedNotifications;
    localStorage.setItem('teacherNotifications', JSON.stringify(storedNotifications));
  };

  // Supprimer une notification
  const deleteNotification = (index) => {
    const updatedNotifications = notifications.filter((_, i) => i !== index);
    setNotifications(updatedNotifications);
    
    // Mettre à jour le localStorage
    const storedNotifications = JSON.parse(localStorage.getItem('teacherNotifications')) || {};
    storedNotifications[user.email] = updatedNotifications;
    localStorage.setItem('teacherNotifications', JSON.stringify(storedNotifications));
  };

  const loadCourseAccessData = useCallback(() => {
    const allStudentCourses = localStorage.getItem('studentCourses') 
      ? JSON.parse(localStorage.getItem('studentCourses'))
      : {};
    
    const accessData = {};
    Object.keys(allStudentCourses).forEach(studentEmail => {
      allStudentCourses[studentEmail].forEach(courseAccess => {
        if (typeof courseAccess === 'object' && courseAccess.courseId) {
          if (!accessData[courseAccess.courseId]) {
            accessData[courseAccess.courseId] = [];
          }
          accessData[courseAccess.courseId].push({
            studentEmail,
            accessTime: courseAccess.accessTime || new Date().toISOString()
          });
        } else {
          if (!accessData[courseAccess]) {
            accessData[courseAccess] = [];
          }
          accessData[courseAccess].push({
            studentEmail,
            accessTime: new Date().toISOString()
          });
        }
      });
    });
    
    setCourseAccessData(accessData);
  }, []);

  const loadCourseRatings = useCallback(() => {
    const ratings = JSON.parse(localStorage.getItem('courseRatings')) || {};
    setCourseRatings(ratings);
  }, []);

  useEffect(() => {
    if (!user || user.userType !== 'teacher') {
      navigate('/login');
      return;
    }

    const storedCourses = getCourses();
    setCourses(storedCourses);
    setFilteredCourses(storedCourses);
    
    if (user.profileImage) {
      setProfileImage(user.profileImage);
    }

    loadCourseAccessData();
    loadCourseRatings();
    loadNotifications();

    const storedComments = JSON.parse(localStorage.getItem('courseComments')) || [];
    setComments(storedComments);
  }, [user, navigate, loadCourseAccessData, loadCourseRatings, loadNotifications]);

  useEffect(() => {
    let filtered = [...courses];
    
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (courseFilter === 'my') {
      filtered = filtered.filter(course => course.teacherEmail === user?.email);
    }
    
    setFilteredCourses(filtered);
  }, [searchTerm, courses, courseFilter, user?.email]);

  const getAverageRating = (courseId) => {
    const ratingsForCourse = courseRatings[courseId] ? Object.values(courseRatings[courseId]) : [];
    if (ratingsForCourse.length === 0) return 0;
    const sum = ratingsForCourse.reduce((a, b) => a + b, 0);
    return (sum / ratingsForCourse.length).toFixed(1);
  };

  const getRatingCount = (courseId) => {
    return courseRatings[courseId] ? Object.keys(courseRatings[courseId]).length : 0;
  };

  const handleLogout = () => {
    if (notifications.some(n => !n.read)) {
      if (!window.confirm('Vous avez des notifications non lues. Voulez-vous vraiment vous déconnecter ?')) {
        return;
      }
    }
    clearCurrentUser();
    navigate('/login');
  };

  const handleAddCourse = () => {
    navigate('/teacher/courses');
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      deleteCourse(courseId);
      const updatedCourses = getCourses();
      setCourses(updatedCourses);
      setFilteredCourses(updatedCourses);
      loadCourseAccessData();
      setExpandedView(false);
      setSelectedCourse(null);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setProfileImage(imageUrl);
        updateProfileImage(user.email, imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setExpandedView(true);
  };

  const handleCloseExpandedView = () => {
    setExpandedView(false);
    setSelectedCourse(null);
  };

  const getCourseComments = (courseId) => {
    return comments.filter(comment => comment.courseId === courseId);
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const getUnreadNotificationsCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gray-100">
      {/* Expanded Course View */}
      <AnimatePresence>
        {expandedView && selectedCourse && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-white z-50 p-6 overflow-y-auto"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-3xl font-bold">{selectedCourse.title}</h1>
                <button onClick={handleCloseExpandedView} className="text-gray-500 hover:text-gray-700 text-2xl">
                  &times;
                </button>
              </div>

              {selectedCourse.mainImage?.url && (
                <img src={selectedCourse.mainImage.url} alt={selectedCourse.title} className="w-full h-64 object-cover mb-6 rounded-lg" />
              )}

              <div className="mb-6">
                <p className="text-gray-700 text-lg mb-4">{selectedCourse.description}</p>
                {selectedCourse.content && (
                  <div dangerouslySetInnerHTML={{ __html: selectedCourse.content }} />
                )}
              </div>

              {/* Rating Information */}
              <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Notes des étudiants</h3>
                <div className="flex items-center">
                  <div className="text-3xl font-bold mr-4">
                    {getAverageRating(selectedCourse.id)}<span className="text-lg text-gray-500">/5</span>
                  </div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-2xl ${
                          star <= Math.round(getAverageRating(selectedCourse.id)) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="ml-4 text-gray-600">
                    ({getRatingCount(selectedCourse.id)} évaluation{getRatingCount(selectedCourse.id) !== 1 ? 's' : ''})
                  </span>
                </div>
              </div>

              {selectedCourse.documents?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Documents</h3>
                  <ul className="space-y-2">
                    {selectedCourse.documents.map((doc, index) => (
                      <li key={index}>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          {doc.name} ({doc.type})
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Commentaires section */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Commentaires des étudiants</h3>
                
                <div className="mb-6">
                  {getCourseComments(selectedCourse.id).length > 0 ? (
                    <div className="space-y-4">
                      {getCourseComments(selectedCourse.id).map(comment => (
                        <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="font-medium text-gray-800">{comment.author}</span>
                              <span className="text-xs text-gray-500 block">{comment.authorEmail}</span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatDate(comment.date)}
                            </span>
                          </div>
                          <p className="text-gray-700">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Aucun commentaire pour ce cours</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center border-t pt-6">
                <div className="text-sm text-gray-500">
                  <p>Créé le: {formatDate(selectedCourse.date)}</p>
                  <p>Professeur: {selectedCourse.teacherName || user?.fullName}</p>
                </div>
                <button
                  onClick={() => handleDeleteCourse(selectedCourse.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Supprimer ce cours
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div 
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-40 overflow-y-auto"
          >
            <div className="p-4 border-b sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Notifications</h2>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
            </div>
            
            <div className="divide-y">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Aucune notification
                </div>
              ) : (
                notifications.map((notification, index) => (
                  <div 
                    key={index} 
                    className={`p-4 ${!notification.read ? 'bg-blue-50' : 'bg-white'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{notification.title}</h3>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(notification.date)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {!notification.read && (
                          <button
                            onClick={() => markNotificationAsRead(index)}
                            className="text-xs text-blue-500 hover:text-blue-700"
                            title="Marquer comme lu"
                          >
                            ✓
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(index)}
                          className="text-xs text-red-500 hover:text-red-700"
                          title="Supprimer"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    {notification.courseId && (
                      <button
                        onClick={() => {
                          const course = courses.find(c => c.id === notification.courseId);
                          if (course) {
                            setSelectedCourse(course);
                            setExpandedView(true);
                            setShowNotifications(false);
                            markNotificationAsRead(index);
                          }
                        }}
                        className="mt-2 text-xs text-blue-500 hover:underline"
                      >
                        Voir le cours
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src={LogoPng} alt="Logo" className="h-10 w-auto" />
            <h1 className="text-3xl font-bold text-gray-900">Espace Professeur</h1>
          </div>
          <div className="flex space-x-4 items-center">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full hover:bg-gray-100"
            >
              <span className="text-xl">🔔</span>
              {getUnreadNotificationsCount() > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getUnreadNotificationsCount()}
                </span>
              )}
            </button>
            <button onClick={handleLogout} className="primary-btn">
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        <div className="bg-white p-6 rounded-lg border border-dashed border-gray-200">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover"/>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-4xl">👤</span>
                  </div>
                )}
              </div>
              <label htmlFor="profile-upload" className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-1 cursor-pointer">
                <span className="text-sm">📷</span>
                <input id="profile-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden"/>
              </label>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Bienvenue, {user?.fullName}</h2>
              <p className="text-gray-600">{user?.email}</p>
              {user?.subject && <p className="text-gray-600">Matière: {user.subject}</p>}
            </div> 
            <div>
              <button
                onClick={handleAddCourse}
                className="primary-btn"
              >
                Ajouter un cours
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Mes cours</h3>
            
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Rechercher un cours par titre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-4 pl-12 pr-6 text-gray-700 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition duration-200"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <span className="text-xl">🔍</span>
                  </div>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <span className="text-xl">×</span>
                    </button>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setCourseFilter('all')}
                    className={`px-4 py-2 rounded-lg ${courseFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    Tous les cours
                  </button>
                  <button
                    onClick={() => setCourseFilter('my')}
                    className={`px-4 py-2 rounded-lg ${courseFilter === 'my' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    Mes cours
                  </button>
                </div>
              </div>
            </div>

            {filteredCourses.length === 0 ? (
              <p className="text-gray-500">
                {searchTerm.trim() === '' 
                  ? `Aucun cours disponible ${courseFilter === 'my' ? 'créé par vous' : ''}` 
                  : `Aucun cours trouvé pour "${searchTerm}" ${courseFilter === 'my' ? 'dans vos cours' : ''}`}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <motion.div 
                    key={course.id}
                    whileHover={{ y: -5 }}
                    className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md cursor-pointer"
                    onClick={() => handleCourseClick(course)}
                  >
                    {course.mainImage?.url && (
                      <img src={course.mainImage.url} alt={course.title} className="w-full h-48 object-cover"/>
                    )}
                    <div className="p-4">
                      <h4 className="font-bold text-lg mb-2">{course.title}</h4>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span className="mr-1">⭐</span>
                        {getAverageRating(course.id)}/5 ({getRatingCount(course.id)} votes)
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span className="mr-1">💬</span>
                        {getCourseComments(course.id).length} commentaire{getCourseComments(course.id).length !== 1 ? 's' : ''}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span className="mr-1">👥</span>
                        {courseAccessData[course.id]?.length || 0} étudiant(s) inscrit(s)
                      </div>
                      
                      <div className="text-xs text-gray-400">
                        <p>Créé par: {course.teacherName || user?.fullName}</p>
                        <p>Créé le: {formatDate(course.date)}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </motion.div>
  );
};

export default HomeTeacher;