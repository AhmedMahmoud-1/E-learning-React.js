import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../utils/localStorage';
import { addCourse, generateId } from '../../utils/localstorage2';
import backgroundImage from '../../assets/bg_login.jpg';

const ProfesseurCours = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState('');

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage({
        name: file.name,
        type: file.type,
        size: file.size,
        file
      });
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newDocuments = files.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
      file
    }));
    setDocuments([...documents, ...newDocuments]);
  };

  const removeMainImage = () => {
    setMainImage(null);
  };

  const removeDocument = (index) => {
    const newDocuments = [...documents];
    newDocuments.splice(index, 1);
    setDocuments(newDocuments);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Le titre du cours est obligatoire');
      return;
    }

    const mainImageDataUrl = mainImage ? await convertToBase64(mainImage.file) : null;

    const documentsData = await Promise.all(
      documents.map(async (doc) => ({
        name: doc.name,
        type: doc.type,
        size: doc.size,
        url: await convertToBase64(doc.file)
      }))
    );

    const newCourse = {
      id: generateId(),
      title,
      description,
      mainImage: mainImageDataUrl ? { url: mainImageDataUrl } : null,
      documents: documentsData,
      teacherId: user.id,
      teacherName: user.fullName,
      teacherEmail: user.email,
      date: new Date().toISOString(),
      subject: user.subject || 'Général'
    };

    addCourse(newCourse);
    navigate('/homeTeacher');
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      <div className="max-w-3xl w-full mx-auto py-8 px-4 relative z-10">
        <div className="bg-white shadow-xl rounded-lg p-6 backdrop-blur-sm bg-white/90">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Ajouter un nouveau cours</h1>
          
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium" htmlFor="title">
                Titre du cours *
              </label>
              <input
                id="title"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">
                Photo principale *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 mb-4 bg-gray-50">
                {mainImage ? (
                  <div className="flex flex-col items-center">
                    <div className="relative mb-2">
                      <img 
                        src={URL.createObjectURL(mainImage.file)} 
                        alt="Preview" 
                        className="h-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={removeMainImage}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2 hover:bg-red-600 transition"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">
                      {mainImage.name} ({Math.round(mainImage.size / 1024)} KB)
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4">
                    <label className="cursor-pointer">
                      <span className="text-blue-500 hover:text-blue-600 transition">Cliquez pour sélectionner une image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageChange}
                        className="hidden"
                        required
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">Format JPG, PNG (MAX. 5MB)</p>
                  </div>
                )}
              </div>

              <label className="block text-gray-700 mb-2 font-medium">
                Documents complémentaires
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 bg-gray-50">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="mb-3"
                />
                
                {documents.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Documents sélectionnés:</h3>
                    <ul className="space-y-2">
                      {documents.map((doc, index) => (
                        <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded hover:bg-gray-200 transition">
                          <span className="text-sm">
                            {doc.name} ({Math.round(doc.size / 1024)} KB)
                          </span>
                          <button
                            type="button"
                            onClick={() => removeDocument(index)}
                            className="text-red-500 hover:text-red-700 transition"
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/homeTeacher')}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Enregistrer le cours
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfesseurCours;
