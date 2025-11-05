'use client'
import React, { useState } from 'react';
import { Download, Upload, FileText, Check } from 'lucide-react';
import JSZip from 'jszip';

interface Message {
  author?: {
    role: string;
  };
  content: {
    parts: string[];
  };
  create_time?: number;
}

interface ConversationNode {
  message?: Message;
}

interface Conversation {
  id: string;
  title?: string;
  create_time?: number;
  mapping?: { [key: string]: ConversationNode };
}

export default function ChatGPTToMDX() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState('');
  const [format, setFormat] = useState<'mdx' | 'md'>('mdx');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // ChatGPT export structure varies, handle both formats
      const convos = Array.isArray(data) ? data : (data.conversations || []);
      setConversations(convos);
      setSelected(new Set());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      alert('Error parsing JSON file: ' + errorMessage);
    }
  };

  const convertToMDX = (convo: Conversation) => {
    const title = convo.title || 'Untitled Conversation';
    const date = convo.create_time 
      ? new Date(convo.create_time * 1000).toISOString()
      : new Date().toISOString();
    
    let mdx = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date}"
id: "${convo.id || ''}"
---

# ${title}

`;

    // Handle mapping structure
    const mapping = convo.mapping || {};
    const nodes = Object.values(mapping || {}).filter((node): node is ConversationNode & { message: Message } => {
      if (!node.message) return false;
      if (!node.message.content) return false;
      return Array.isArray(node.message.content.parts);
    });

    // Sort by create_time if available
    nodes.sort((a, b) => {
      const timeA = a.message?.create_time || 0;
      const timeB = b.message?.create_time || 0;
      return timeA - timeB;
    });

    nodes.forEach(node => {
      if (!node.message) return;
      const role = node.message.author?.role || 'unknown';
      const parts = node.message.content.parts;
      const text = parts.join('\n\n');

      if (!text.trim()) return;

      if (role === 'user') {
        mdx += `## User\n\n${text}\n\n`;
      } else if (role === 'assistant') {
        mdx += `## Assistant\n\n${text}\n\n`;
      } else if (role === 'system') {
        mdx += `## System\n\n${text}\n\n`;
      }
    });

    return mdx;
  };

  const convertToMD = (convo: Conversation) => {
    const title = convo.title || 'Untitled Conversation';
    const date = convo.create_time 
      ? new Date(convo.create_time * 1000).toISOString()
      : new Date().toISOString();
    
    let md = `# ${title}\n\n`;
    md += `**Date:** ${date}\n`;
    md += `**ID:** ${convo.id || ''}\n\n`;
    md += `---\n\n`;

    // Handle mapping structure
    const mapping = convo.mapping || {};
    const nodes = Object.values(mapping || {}).filter((node): node is ConversationNode & { message: Message } => {
      if (!node.message) return false;
      if (!node.message.content) return false;
      return Array.isArray(node.message.content.parts);
    });

    // Sort by create_time if available
    nodes.sort((a, b) => {
      const timeA = a.message?.create_time || 0;
      const timeB = b.message?.create_time || 0;
      return timeA - timeB;
    });

    nodes.forEach(node => {
      if (!node.message) return;
      const role = node.message.author?.role || 'unknown';
      const parts = node.message.content.parts;
      const text = parts.join('\n\n');

      if (!text.trim()) return;

      if (role === 'user') {
        md += `## User\n\n${text}\n\n`;
      } else if (role === 'assistant') {
        md += `## Assistant\n\n${text}\n\n`;
      } else if (role === 'system') {
        md += `## System\n\n${text}\n\n`;
      }
    });

    return md;
  };

  const downloadFile = (convo: Conversation) => {
    const content = format === 'mdx' ? convertToMDX(convo) : convertToMD(convo);
    const extension = format === 'mdx' ? 'mdx' : 'md';
    const filename = `${(convo.title || 'conversation').replace(/[^a-z0-9]/gi, '-').toLowerCase()}.${extension}`;
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadSelected = async () => {
    if (selected.size === 0) return;
    
    const selectedConvos = conversations.filter(c => selected.has(c.id));
    const extension = format === 'mdx' ? 'mdx' : 'md';
    
    if (selected.size === 1) {
      downloadFile(selectedConvos[0]);
    } else {
      // Create a zip file containing all selected files
      const zip = new JSZip();
      
      selectedConvos.forEach((convo) => {
        const content = format === 'mdx' ? convertToMDX(convo) : convertToMD(convo);
        const filename = `${(convo.title || 'conversation').replace(/[^a-z0-9]/gi, '-').toLowerCase()}.${extension}`;
        zip.file(filename, content);
      });
      
      // Generate and download the zip file
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'conversations.zip';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const toggleAll = () => {
    if (selected.size === filteredConvos.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredConvos.map(c => c.id)));
    }
  };

  const filteredConvos = conversations.filter(c => 
    !filter || c.title?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <FileText className="text-indigo-600" />
            ChatGPT logs in JSON convert to MDX/MD files
          </h1>
          <p className="text-gray-600 mb-6">
            Upload your ChatGPT export JSON and convert conversations to MDX or MD format
          </p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Output Format
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="mdx"
                  checked={format === 'mdx'}
                  onChange={(e) => setFormat(e.target.value as 'mdx' | 'md')}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-gray-700">MDX (with frontmatter)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="md"
                  checked={format === 'md'}
                  onChange={(e) => setFormat(e.target.value as 'mdx' | 'md')}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-gray-700">MD (standard markdown)</span>
              </label>
            </div>
          </div>

          <label className="flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors">
            <Upload size={20} />
            <span className="font-medium">Upload conversations.json</span>
            <input 
              type="file" 
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {conversations.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4 flex-1">
                <input
                  type="text"
                  placeholder="Filter conversations..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={toggleAll}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {selected.size === filteredConvos.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              
              {selected.size > 0 && (
                <button
                  onClick={downloadSelected}
                  className="ml-4 flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download size={18} />
                  Download {selected.size} {format.toUpperCase()} {selected.size === 1 ? 'file' : 'files'}
                </button>
              )}
            </div>

            <div className="text-sm text-gray-600 mb-4">
              Found {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
              {filter && ` (${filteredConvos.length} matching)`}
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredConvos.map((convo) => (
                <div
                  key={convo.id}
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                    selected.has(convo.id)
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                  }`}
                  onClick={() => toggleSelect(convo.id)}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    selected.has(convo.id)
                      ? 'border-indigo-600 bg-indigo-600'
                      : 'border-gray-300'
                  }`}>
                    {selected.has(convo.id) && <Check size={14} className="text-white" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 truncate">
                      {convo.title || 'Untitled Conversation'}
                    </div>
                    {convo.create_time && (
                      <div className="text-sm text-gray-500">
                        {new Date(convo.create_time * 1000).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadFile(convo);
                    }}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors flex-shrink-0"
                  >
                    Export
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}