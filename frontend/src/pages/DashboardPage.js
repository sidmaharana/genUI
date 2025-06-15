// pages/DashboardPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Plus, Code, Trash2, Edit, Layers } from 'lucide-react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    language: 'html'
  });
  const [loading, setLoading] = useState(true);

// eslint-disable-next-line no-undef
const fetchUserProjects = useCallback(async () => {
  try {
    const q = query(collection(db, 'projects'), where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    const userProjects = [];
    querySnapshot.forEach((doc) => {
      userProjects.push({ id: doc.id, ...doc.data() });
    });
    setProjects(userProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    toast.error('Failed to load projects');
  } finally {
    setLoading(false);
  }
}, [user]);

useEffect(() => {
  if (user) {
    fetchUserProjects();
  }
}, [user, fetchUserProjects]);


    useEffect(() => {
      if (user) {
        fetchUserProjects();
      }
    }, [user, fetchUserProjects]); // ✅ Now included properly


  const createProject = async (e) => {
    e.preventDefault();
    try {
      const projectData = {
        ...newProject,
        userId: user.uid,
        createdAt: new Date(),
        generatedCode: ''
      };

      const docRef = await addDoc(collection(db, 'projects'), projectData);
      toast.success('Project created successfully!');
      setShowCreateModal(false);
      setNewProject({ title: '', description: '', language: 'html' });
      navigate(`/project/${docRef.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    }
  };

  const deleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteDoc(doc(db, 'projects', projectId));
        setProjects(projects.filter(p => p.id !== projectId));
        toast.success('Project deleted successfully');
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.displayName || 'Creator'}!
          </h1>
          <p className="text-purple-200">Design, preview, and build your UI visually</p>
        </motion.div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Your UI Projects</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            New Project
          </motion.button>
        </div>

        {projects.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <Layers className="h-16 w-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No UI projects yet</h3>
            <p className="text-purple-200 mb-6">Start by creating a beautiful interface today!</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-lg"
            >
              Create UI Project
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-white truncate">{project.title}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/project/${project.id}`)} className="text-purple-400 hover:text-purple-300">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => deleteProject(project.id)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="text-purple-200 text-sm mb-4 line-clamp-2">{project.description}</p>

                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">
                    {project.language}
                  </span>
                </div>

                <button
                  onClick={() => navigate(`/project/${project.id}`)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                >
                  <Code className="h-4 w-4" />
                  Open Project
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">Create UI Project</h2>

              <form onSubmit={createProject} className="space-y-4">
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">Project Title</label>
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                    placeholder="e.g., Portfolio UI"
                    required
                  />
                </div>

                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                    placeholder="Describe the UI you want to create..."
                    rows="3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">Tech Stack</label>
                  <select
                    value={newProject.language}
                    onChange={(e) => setNewProject({...newProject, language: e.target.value})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="html">HTML</option>
                    <option value="javascript">JavaScript</option>
                    <option value="react">React</option>
                    <option value="tailwind">TailwindCSS</option>
                    <option value="vue">Vue.js</option>
                    <option value="nextjs">Next.js</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-medium py-2 px-4 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-lg"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
