import React, { useState, useEffect } from 'react';
import { getCourses, deleteCourse } from '../../utils/localstorage2';

const Admin = () => {
  const [professeurs, setProfesseurs] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [cours, setCours] = useState([]);
  const [activeTab, setActiveTab] = useState('professeurs');
  const [refresh, setRefresh] = useState(false);

  // Fonctions pour récupérer les données
  const getUsers = () => JSON.parse(localStorage.getItem('users')) || [];
  const getAllCourses = () => JSON.parse(localStorage.getItem('teacherCourses')) || [];

  const getAverageRating = (courseId) => {
    const ratings = JSON.parse(localStorage.getItem('courseRatings')) || {};
    const courseRatings = ratings[courseId] ? Object.values(ratings[courseId]) : [];
    if (courseRatings.length === 0) return 0;
    const sum = courseRatings.reduce((a, b) => a + b, 0);
    return (sum / courseRatings.length).toFixed(1);
  };

  const getRatingCount = (courseId) => {
    const ratings = JSON.parse(localStorage.getItem('courseRatings')) || {};
    return ratings[courseId] ? Object.keys(ratings[courseId]).length : 0;
  };

  // Charger les données
  useEffect(() => {
    const allUsers = getUsers();
    
    // Filtrage basé sur userType comme dans votre système de login
    setProfesseurs(allUsers.filter(user => user.userType === 'teacher'));
    setEtudiants(allUsers.filter(user => user.userType === 'student'));
    setCours(getAllCourses());
  }, [refresh]);

  // Supprimer un utilisateur
  const deleteUser = (email) => {
    const users = getUsers().filter(user => user.email !== email);
    localStorage.setItem('users', JSON.stringify(users));
    setRefresh(!refresh);
  };

  // Supprimer un cours
  const handleDeleteCourse = (courseId) => {
    deleteCourse(courseId);
    setRefresh(!refresh);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Tableau de bord Administrateur</h1>
      
      {/* Navigation par onglets */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'professeurs' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('professeurs')}
        >
          Professeurs ({professeurs.length})
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'etudiants' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('etudiants')}
        >
          Étudiants ({etudiants.length})
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'cours' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('cours')}
        >
          Cours ({cours.length})
        </button>
      </div>

      {/* Contenu des onglets */}
      <div className="bg-white rounded-lg shadow-md p-4">
        {activeTab === 'professeurs' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Liste des Professeurs</h2>
            {professeurs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cours créés</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {professeurs.map((prof, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {prof.profileImage && (
                            <img src={prof.profileImage} alt="Profile" className="w-10 h-10 rounded-full" />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {prof.nom || prof.name || prof.email.split('@')[0]}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{prof.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {cours.filter(c => c.teacherEmail === prof.email).length}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => deleteUser(prof.email)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">Aucun professeur trouvé</p>
            )}
          </div>
        )}

        {activeTab === 'etudiants' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Liste des Étudiants</h2>
            {etudiants.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {etudiants.map((etud, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {etud.profileImage && (
                            <img src={etud.profileImage} alt="Profile" className="w-10 h-10 rounded-full" />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {etud.nom || etud.name || etud.email.split('@')[0]}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{etud.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => deleteUser(etud.email)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">Aucun étudiant trouvé</p>
            )}
          </div>
        )}

        {activeTab === 'cours' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Liste des Cours</h2>
            {cours.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cours.map((cour, index) => {
                  const avgRating = getAverageRating(cour.id);
                  const ratingCount = getRatingCount(cour.id);
                  const prof = professeurs.find(p => p.email === cour.teacherEmail);
                  
                  return (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition flex flex-col">
                      {cour.mainImage?.url && (
                        <img 
                          src={cour.mainImage.url} 
                          alt={cour.title} 
                          className="w-full h-40 object-cover rounded-t-lg mb-3"
                        />
                      )}
                      <h3 className="font-medium text-lg mb-1">{cour.title}</h3>
                      <p className="text-gray-600 mb-2 flex-grow">
                        {cour.description?.substring(0, 100)}{cour.description?.length > 100 ? '...' : ''}
                      </p>
                      <div className="mb-2">
                        <p className="text-sm text-gray-500">
                          Professeur: {prof?.nom || prof?.name || cour.teacherEmail}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-yellow-500 font-medium">
                          {avgRating} ★ ({ratingCount} avis)
                        </span>
                        <div className="flex space-x-2">
                          <span className="text-sm text-gray-500">
                            {new Date(cour.date).toLocaleDateString()}
                          </span>
                          <button
                            onClick={() => handleDeleteCourse(cour.id)}
                            className="text-red-600 hover:text-red-900 text-sm"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">Aucun cours trouvé</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;