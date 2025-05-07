import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, clearCurrentUser, updateProfileImage } from '../../utils/localStorage';
import { getCourses, addStudentCourse, getStudentCourses } from '../../utils/localstorage2';
import { motion, AnimatePresence } from 'framer-motion';
import LogoPng from "../../assets/logo.png";

const HomeStudent = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [expandedView, setExpandedView] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [ratings, setRatings] = useState({});
  const [hoverRating, setHoverRating] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');

  // Fonction pour ajouter des notifications aux professeurs
  const addTeacherNotification = (teacherEmail, title, message, courseId = null) => {
    const storedNotifications = JSON.parse(localStorage.getItem('teacherNotifications')) || {};
    
    if (!storedNotifications[teacherEmail]) {
      storedNotifications[teacherEmail] = [];
    }
    
    storedNotifications[teacherEmail].unshift({
      title,
      message,
      courseId,
      date: new Date().toISOString(),
      read: false
    });
    
    localStorage.setItem('teacherNotifications', JSON.stringify(storedNotifications));
  };

  // Charger les données initiales
  useEffect(() => {
    if (!user || user.userType !== 'student') {
      navigate('/login');
      return;
    }

    const loadData = () => {
      const storedCourses = getCourses();
      setCourses(storedCourses);
      setFilteredCourses(storedCourses);
      
      if (user.profileImage) {
        setProfileImage(user.profileImage);
      }

      // Charger les cours auxquels l'étudiant est inscrit
      const enrolled = getStudentCourses(user.email).map(c => c.courseId || c);
      setEnrolledCourses(enrolled);

      // Charger les commentaires et notes
      const storedComments = JSON.parse(localStorage.getItem('courseComments')) || [];
      setComments(storedComments);
      
      const storedRatings = JSON.parse(localStorage.getItem('courseRatings')) || {};
      setRatings(storedRatings);
    };

    loadData();
  }, [user, navigate]);

  // Filtrer les cours en fonction de la recherche et du filtre
  useEffect(() => {
    let filtered = [...courses];
    
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (courseFilter === 'my') {
      filtered = filtered.filter(course => 
        enrolledCourses.some(id => id === course.id)
      );
    }
    
    setFilteredCourses(filtered);
  }, [searchTerm, courses, courseFilter, enrolledCourses]);

  const handleLogout = () => {
    clearCurrentUser();
    navigate('/login');
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

  const handleAccessCourse = async (courseId, e) => {
    e.stopPropagation();
    if (!user?.email) return;

    try {
      const success = await addStudentCourse(user.email, courseId);
      if (success) {
        setEnrolledCourses(prev => [...prev, courseId]);
        
        // Envoyer une notification au professeur
        const course = courses.find(c => c.id === courseId);
        if (course?.teacherEmail) {
          addTeacherNotification(
            course.teacherEmail,
            'Nouvel accès à votre cours',
            `${user.fullName} (${user.email}) a accédé à votre cours "${course.title}"`,
            courseId
          );
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'accès au cours:", error);
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

  const handleAddComment = () => {
    if (!newComment.trim() || !user?.fullName || !selectedCourse) return;

    const comment = {
      id: Date.now(),
      author: user.fullName,
      authorEmail: user.email,
      text: newComment,
      date: new Date().toISOString(),
      courseId: selectedCourse.id
    };
    
    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    localStorage.setItem('courseComments', JSON.stringify(updatedComments));
    setNewComment('');
    
    // Envoyer une notification au professeur
    if (selectedCourse.teacherEmail) {
      addTeacherNotification(
        selectedCourse.teacherEmail,
        'Nouveau commentaire sur votre cours',
        `${user.fullName} (${user.email}) a commenté votre cours "${selectedCourse.title}"`,
        selectedCourse.id
      );
    }
  };

  const handleDeleteComment = (commentId) => {
    const updatedComments = comments.filter(comment => comment.id !== commentId);
    setComments(updatedComments);
    localStorage.setItem('courseComments', JSON.stringify(updatedComments));
  };

  const getCourseComments = (courseId) => {
    return comments.filter(comment => comment.courseId === courseId);
  };

  const canDeleteComment = (comment) => {
    return comment.authorEmail === user?.email || user?.userType === 'admin';
  };

  const handleRateCourse = (courseId, rating) => {
    if (!user?.email) return;

    const newRatings = { ...ratings };
    if (!newRatings[courseId]) {
      newRatings[courseId] = {};
    }
    newRatings[courseId][user.email] = rating;
    setRatings(newRatings);
    localStorage.setItem('courseRatings', JSON.stringify(newRatings));
  };

  const getUserRating = (courseId) => {
    return user?.email ? (ratings[courseId]?.[user.email] || 0) : 0;
  };

  const getAverageCourseRating = (courseId) => {
    const courseRatings = ratings[courseId] ? Object.values(ratings[courseId]) : [];
    if (courseRatings.length === 0) return 0;
    const sum = courseRatings.reduce((a, b) => a + b, 0);
    return (sum / courseRatings.length).toFixed(1);
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

  const isCourseEnrolled = (courseId) => {
    return enrolledCourses.some(id => id === courseId);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gray-100">
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
                <button 
                  onClick={handleCloseExpandedView} 
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                  aria-label="Fermer la vue détaillée"
                >
                  &times;
                </button>
              </div>

              {selectedCourse.mainImage?.url && (
                <img 
                  src={selectedCourse.mainImage.url} 
                  alt={selectedCourse.title} 
                  className="w-full h-64 object-cover mb-6 rounded-lg"
                />
              )}

              <div className="mb-6">
                <p className="text-gray-700 text-lg mb-4">{selectedCourse.description}</p>
                {selectedCourse.content && (
                  <div dangerouslySetInnerHTML={{ __html: selectedCourse.content }} />
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Notez ce cours</h3>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRateCourse(selectedCourse.id, star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="text-2xl focus:outline-none"
                      aria-label={`Noter ${star} étoile`}
                    >
                      <span className={
                        star <= (hoverRating || getUserRating(selectedCourse.id)) 
                          ? 'text-yellow-400' 
                          : 'text-gray-300'
                      }>
                        {star <= (hoverRating || getUserRating(selectedCourse.id)) ? '★' : '☆'}
                      </span>
                    </button>
                  ))}
                  <span className="ml-2 text-gray-600">
                    {getAverageCourseRating(selectedCourse.id)}/5 ({Object.keys(ratings[selectedCourse.id] || {}).length} votes)
                  </span>
                </div>
              </div>

              {selectedCourse.documents?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Documents</h3>
                  <ul className="space-y-2">
                    {selectedCourse.documents.map((doc, index) => (
                      <li key={index}>
                        <a 
                          href={doc.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-500 hover:underline"
                        >
                          {doc.name} ({doc.type})
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Commentaires</h3>
                
                <div className="mb-6">
                  {getCourseComments(selectedCourse.id).length > 0 ? (
                    <div className="space-y-4">
                      {getCourseComments(selectedCourse.id).map(comment => (
                        <div key={comment.id} className="bg-gray-50 p-4 rounded-lg relative">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-gray-800">{comment.author}</span>
                            <span className="text-sm text-gray-500">
                              {formatDate(comment.date)}
                            </span>
                          </div>
                          <p className="text-gray-700">{comment.text}</p>
                          {canDeleteComment(comment) && (
                            <button 
                              onClick={() => handleDeleteComment(comment.id)}
                              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                              aria-label="Supprimer le commentaire"
                            >
                              &times;
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Aucun commentaire pour ce cours</p>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Ajouter un commentaire</h4>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Votre commentaire..."
                    className="w-full p-3 border rounded-md mb-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    aria-label="Zone de texte pour commentaire"
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Publier
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center border-t pt-6">
                <div className="text-sm text-gray-500">
                  <p>Créé le: {formatDate(selectedCourse.date)}</p>
                  {selectedCourse.teacherName && <p>Professeur: {selectedCourse.teacherName}</p>}
                </div>
                <button
                  onClick={(e) => handleAccessCourse(selectedCourse.id, e)}
                  disabled={isCourseEnrolled(selectedCourse.id)}
                  className={`px-4 py-2 rounded-md text-white ${
                    isCourseEnrolled(selectedCourse.id) 
                      ? 'bg-green-500' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                  aria-label={
                    isCourseEnrolled(selectedCourse.id) 
                      ? 'Accès déjà obtenu' 
                      : 'Obtenir accès au cours'
                  }
                >
                  {isCourseEnrolled(selectedCourse.id) ? 'Accès obtenu ✓' : 'Obtenir accès'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src={LogoPng} alt="Logo" className="h-10 w-auto" />
            <h1 className="text-3xl font-bold text-gray-900">Espace Étudiant</h1>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={handleLogout} 
              className="primary-btn">
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
              <label 
                htmlFor="profile-upload" 
                className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-1 cursor-pointer"
              >
                <span className="text-sm">📷</span>
                <input 
                  id="profile-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Bienvenue, {user?.fullName}</h2>
              <p className="text-gray-600">{user?.email}</p>
              {user?.class && <p className="text-gray-600">Classe: {user.class}</p>}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Cours disponibles</h3>
            
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Rechercher un cours par titre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-4 pl-12 pr-6 text-gray-700 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition duration-200"
                    aria-label="Rechercher un cours"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <span className="text-xl">🔍</span>
                  </div>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="Effacer la recherche"
                    >
                      <span className="text-xl">×</span>
                    </button>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setCourseFilter('all')}
                    className={`px-4 py-2 rounded-lg ${
                      courseFilter === 'all' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Tous les cours
                  </button>
                  <button
                    onClick={() => setCourseFilter('my')}
                    className={`px-4 py-2 rounded-lg ${
                      courseFilter === 'my' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Mes cours
                  </button>
                </div>
              </div>
            </div>

            {filteredCourses.length === 0 ? (
              <p className="text-gray-500">
                {searchTerm.trim() === '' 
                  ? `Aucun cours disponible ${courseFilter === 'my' ? 'dans votre liste' : ''}` 
                  : `Aucun cours trouvé pour "${searchTerm}" ${courseFilter === 'my' ? 'dans votre liste' : ''}`}
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
                      <img 
                        src={course.mainImage.url} 
                        alt={course.title} 
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h4 className="font-bold text-lg mb-2">{course.title}</h4>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span className="mr-1">⭐</span>
                        {getAverageCourseRating(course.id)}/5
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span className="mr-1">💬</span>
                        {getCourseComments(course.id).length} commentaire{getCourseComments(course.id).length !== 1 ? 's' : ''}
                      </div>
                      <button
                        onClick={(e) => handleAccessCourse(course.id, e)}
                        disabled={isCourseEnrolled(course.id)}
                        className={`w-full py-2 px-4 rounded-md text-white ${
                          isCourseEnrolled(course.id) 
                            ? 'bg-green-500 cursor-default' 
                            : 'bg-blue-500 hover:bg-blue-600'
                        } transition-colors duration-200`}
                        aria-label={
                          isCourseEnrolled(course.id) 
                            ? 'Accès déjà obtenu' 
                            : 'Accéder au cours'
                        }
                      >
                        {isCourseEnrolled(course.id) ? 'Accès obtenu ✓' : 'Accéder au cours'}
                      </button>
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

export default HomeStudent;