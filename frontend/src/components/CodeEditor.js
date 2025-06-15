import React, { useState, useEffect, useRef } from 'react';
import { Play, Copy, RotateCcw, Save, Eye, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const CodeEditor = ({ language = 'html', initialCode = '', onChange, project }) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  const iframeRef = useRef(null);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  useEffect(() => {
    if (onChange) onChange(code);
  }, [code, onChange]);

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running code...');

    try {
      if (['html', 'javascript', 'css'].includes(language)) {
        const htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>${language === 'css' ? code : ''}</style>
          </head>
          <body>
            ${language === 'html' ? code : ''}
            ${language === 'javascript' ? `<script>${code}</script>` : ''}
          </body>
          </html>
        `;

        const iframe = iframeRef.current;
        if (iframe) {
          const doc = iframe.contentDocument || iframe.contentWindow.document;
          doc.open();
          doc.write(htmlContent);
          doc.close();
        }

        setOutput('Preview generated below.');
      } else {
        const response = await fetch('/api/execute-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, language }),
        });

        const result = await response.json();
        setOutput(result.output || result.error || 'No output');
      }
    } catch (error) {
      console.error('Execution error:', error);
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const generateWithPrompt = async () => {
    if (!promptInput.trim()) return;

    setIsGenerating(true);
    toast.loading('Refining code with AI...');

    try {
      const response = await fetch('/api/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptInput,
          language
        }),
      });

      const data = await response.json();
      setCode(data.code || '');
      toast.dismiss();
      toast.success('Updated with AI!');
    } catch (error) {
      console.error('AI refine error:', error);
      toast.dismiss();
      toast.error('Failed to refine code');
    } finally {
      setIsGenerating(false);
      setPromptInput('');
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied!');
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput('');
    toast.success('Code reset!');
  };

  const saveCode = () => {
    localStorage.setItem(`saved-code-${language}`, code);
    toast.success('Code saved locally!');
  };

  return (
    <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
      <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
        <div className="text-slate-300 font-mono">
          {language}.{language === 'javascript' ? 'js' : language === 'html' ? 'html' : language === 'css' ? 'css' : 'txt'}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={copyCode} title="Copy">
            <Copy className="h-4 w-4 text-slate-400 hover:text-white" />
          </button>
          <button onClick={resetCode} title="Reset">
            <RotateCcw className="h-4 w-4 text-slate-400 hover:text-white" />
          </button>
          <button onClick={saveCode} title="Save">
            <Save className="h-4 w-4 text-slate-400 hover:text-white" />
          </button>
          <button
            onClick={() => generateWithPrompt()}
            disabled={isGenerating}
            title="Generate with AI"
            className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-2 py-1 rounded flex items-center gap-1 text-sm"
          >
            <Sparkles className="h-4 w-4" />
            {isGenerating ? 'Generating...' : 'AI'}
          </button>
          <button
            onClick={runCode}
            disabled={isRunning}
            className="bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
          >
            <Play className="h-3 w-3" />
            {isRunning ? 'Running...' : 'Run'}
          </button>
        </div>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder={`Write your ${language} code here...`}
        className="w-full h-64 bg-slate-900 text-green-300 font-mono text-sm p-4 resize-none focus:outline-none"
        spellCheck="false"
      />

      <div className="border-t border-slate-800 bg-slate-900 px-4 py-3 flex items-center gap-2">
        <input
          type="text"
          placeholder="Refine with a prompt (e.g., add navbar, improve styling)..."
          className="flex-1 bg-slate-800 text-sm text-white border border-slate-600 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-purple-500"
          value={promptInput}
          onChange={(e) => setPromptInput(e.target.value)}
        />
        <button
          onClick={generateWithPrompt}
          disabled={isGenerating || !promptInput.trim()}
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
        >
          Refine
        </button>
      </div>

      {['html', 'javascript', 'css'].includes(language) ? (
        <div className="border-t border-slate-700">
          <div className="bg-slate-800 px-4 py-2 text-slate-300 text-sm font-medium flex items-center gap-1">
            <Eye className="h-4 w-4" />
            Live Preview
          </div>
          <iframe
            ref={iframeRef}
            title="Live Preview"
            sandbox="allow-scripts allow-same-origin"
            className="w-full h-96 bg-white"
          ></iframe>
        </div>
      ) : (
        <div className="border-t border-slate-700">
          <div className="bg-slate-800 px-4 py-2 text-slate-300 text-sm font-medium">Output</div>
          <div className="p-4 h-96 overflow-y-auto text-green-300 font-mono text-sm whitespace-pre-wrap">
            {output}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
