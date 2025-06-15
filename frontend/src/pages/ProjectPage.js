import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import CodeEditor from '../components/CodeEditor';
import toast from 'react-hot-toast';

const ProjectPage = () => {
  const { projectId } = useParams();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const ref = doc(db, 'projects', projectId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setProject(data);
          setUserCode(data.generatedCode || '');
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        toast.error('Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProject();
  }, [user, projectId]);

  const handleSaveCode = async () => {
    if (!project) return;
    try {
      const ref = doc(db, 'projects', projectId);
      await updateDoc(ref, { generatedCode: userCode });
      toast.success('Code saved successfully!');
    } catch (err) {
      console.error('Error saving code:', err);
      toast.error('Failed to save code');
    }
  };

  if (loading || !project) return <div className="text-white p-8">Loading UI project...</div>;

  return (
    <div className="p-8 bg-slate-950 text-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-purple-400">GenUI: {project.title}</h1>
        <p className="text-gray-400 mt-1">Tech Stack: {project.language}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Editor */}
        <div>
          <CodeEditor
            language={project.language}
            initialCode={userCode}
            onChange={setUserCode}
            project={project} // ✅ Pass the full project object
          />
        </div>

        {/* Live Preview */}
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
          {(project.language === 'html' || project.language === 'javascript' || project.language === 'css') ? (
            <iframe
              title="GenUI Preview"
              sandbox="allow-scripts allow-same-origin"
              className="w-full h-96 bg-white rounded"
              srcDoc={`<!DOCTYPE html><html><head><style>${project.language === 'css' ? userCode : ''}</style></head><body>${project.language === 'html' ? userCode : ''}${project.language === 'javascript' ? `<script>${userCode}</script>` : ''}</body></html>`}
            />
          ) : (
            <p className="text-gray-400">
              Output will appear here after using the <strong>Run</strong> button inside the editor.
            </p>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 text-right">
        <button
          onClick={handleSaveCode}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded shadow"
        >
          Save UI Code
        </button>
      </div>
    </div>
  );
};

export default ProjectPage;
